import { useState, useEffect } from "react";
import { PAGES } from "./constants/pages";
import { QUIZ_STEPS } from "./constants/quiz";
import { useAuth } from "./hooks/useAuth";
import { toast } from "./hooks/useToast";
import { storage } from "./utils/storage";
import { decodeShare } from "./utils/share";
import { callAI } from "./utils/api";
import Topbar from "./components/layout/Topbar";
import ToastContainer from "./components/ui/ToastContainer";
import Confetti from "./components/results/Confetti";
import SwapModal from "./components/modals/SwapModal";
import SavedModal from "./components/modals/SavedModal";
import PriceCompareModal from "./components/modals/PriceCompareModal";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Quiz from "./pages/Quiz";
import Generating from "./pages/Generating";
import Results from "./pages/Results";

function scrollTop() {
  try {
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch {}
}

export default function App() {
  const auth = useAuth();

  // ── Page state ──
  const [page, setPage] = useState(PAGES.LANDING);

  // ── Quiz state ──
  const [qi, setQi] = useState(0);
  const [ans, setAns] = useState({});
  const [genErr, setGenErr] = useState("");
  const [genMsg, setGenMsg] = useState(0);

  // ── Results state ──
  const [setup, setSetup] = useState(null);
  const [items, setItems] = useState([]);
  const [carted, setCarted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // ── Modals ──
  const [swapTarget, setSwapTarget] = useState(null);
  const [compareTarget, setCompareTarget] = useState(null);
  const [showSaved, setShowSaved] = useState(false);

  // ── Saved setups ──
  const [saves, setSaves] = useState(() => storage.get("sg_saves", []));

  const step = QUIZ_STEPS[qi];

  // ── Init quiz defaults ──
  useEffect(() => {
    if (!step) return;
    if (
      (step.type === "budget" || step.type === "slider") &&
      ans[step.id] === undefined
    )
      setAns((a) => ({ ...a, [step.id]: step.def }));
    if (step.type === "rank" && !ans[step.id])
      setAns((a) => ({ ...a, [step.id]: step.opts.map((o) => o.v) }));
  }, [qi]);

  // ── Save quiz progress to sessionStorage ──
  useEffect(() => {
    if (Object.keys(ans).length > 0)
      sessionStorage.setItem("sg_quiz_progress", JSON.stringify({ qi, ans }));
  }, [qi, ans]);

  // ── Restore quiz progress on mount ──
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("sg_quiz_progress");
      if (saved) {
        const { qi: savedQi, ans: savedAns } = JSON.parse(saved);
        if (savedQi > 0) {
          setQi(savedQi);
          setAns(savedAns);
          setPage(PAGES.QUIZ);
          toast.info("Quiz progress restored!");
        }
      }
    } catch {}
  }, []);

  // ── Dynamic page title ──
  useEffect(() => {
    const titles = {
      [PAGES.LANDING]: "SetupGenie — AI-Powered WFH Setup Builder",
      [PAGES.AUTH]: "Sign In — SetupGenie",
      [PAGES.QUIZ]: `Step ${qi + 1} of ${QUIZ_STEPS.length} — SetupGenie`,
      [PAGES.GEN]: "Building Your Setup — SetupGenie",
      [PAGES.RESULTS]: setup
        ? `${setup.headline} — SetupGenie`
        : "Your Setup — SetupGenie",
    };
    document.title = titles[page] || "SetupGenie";
  }, [page, qi, setup]);

  // ── Load shared setup from URL hash ──
  useEffect(() => {
    const shared = decodeShare(window.location.hash);
    if (shared?.setup && shared?.answers) {
      setSetup(shared.setup);
      setItems(Array.isArray(shared.setup.items) ? shared.setup.items : []);
      setAns(shared.answers);
      setPage(PAGES.RESULTS);
      toast.info("Shared setup loaded!");
    }
  }, []);

  // ── Can continue quiz? ──
  const canGo = step
    ? step.type === "multi"
      ? (ans[step.id] || []).length > 0
      : step.type === "card"
        ? !!ans[step.id]
        : step.type === "vibe"
          ? !!ans[step.id]
          : step.type === "budget"
            ? (ans[step.id] || 0) >= step.min
            : step.type === "slider"
              ? true
              : step.type === "rank"
                ? true
                : false
    : false;

  // ── Navigation ──
  function goNext(overrideAns) {
    const a = overrideAns || ans;
    scrollTop();
    if (qi < QUIZ_STEPS.length - 1) setQi(qi + 1);
    else startGenerate(a);
  }

  function goBack() {
    scrollTop();
    if (qi > 0) setQi(qi - 1);
    else setPage(PAGES.LANDING);
  }

  function goLanding() {
    scrollTop();
    sessionStorage.removeItem("sg_quiz_progress");
    setPage(PAGES.LANDING);
    setQi(0);
    setAns({});
    setSetup(null);
    setItems([]);
    setCarted(false);
    setCopied(false);
    setGenErr("");
    setShowConfetti(false);
  }

  // ── Generation ──
  async function startGenerate(answers) {
    scrollTop();
    setPage(PAGES.GEN);
    setGenErr("");
    setGenMsg(0);
    const iv = setInterval(() => setGenMsg((m) => Math.min(m + 1, 5)), 1100);
    try {
      const result = await callAI(answers);
      clearInterval(iv);
      setSetup(result);
      setItems(result.items);
      const newSave = {
        id: Date.now(),
        setup: result,
        answers,
        date: new Date().toLocaleDateString("en-IN"),
      };
      const updated = [newSave, ...storage.get("sg_saves", []).slice(0, 9)];
      storage.set("sg_saves", updated);
      setSaves(updated);
      scrollTop();
      setPage(PAGES.RESULTS);
      setShowConfetti(true);
    } catch (e) {
      clearInterval(iv);
      console.error("[SetupGenie]", e);
      const msg = e.message?.includes("429")
        ? "Too many requests — wait 30s and retry"
        : e.message?.includes("401")
          ? "API key issue — please check .env"
          : e.message?.includes("Parse")
            ? "AI response unclear — please retry"
            : e.message?.includes("No items")
              ? "No items returned — try higher budget"
              : "Generation failed — please try again";
      setGenErr(msg);
      setPage(PAGES.QUIZ);
    }
  }

  function handleLoadSave(s) {
    if (!s?.setup) return;
    setSetup(s.setup);
    setItems(Array.isArray(s.setup.items) ? s.setup.items : []);
    setAns(s.answers || {});
    setShowSaved(false);
    scrollTop();
    setPage(PAGES.RESULTS);
    toast.success("Setup loaded!");
  }

  function handleDeleteSave(id, e) {
    e.stopPropagation();
    const updated = saves.filter((s) => s.id !== id);
    storage.set("sg_saves", updated);
    setSaves(updated);
    toast.info("Setup deleted");
  }

  return (
    <>
      {/* Global UI */}
      <ToastContainer />
      {showConfetti && <Confetti key={Date.now()} />}

      {/* Modals */}
      {swapTarget && (
        <SwapModal
          item={swapTarget}
          onSwap={(item, alt) => {
            setItems((prev) =>
              prev.map((i) =>
                i === item
                  ? {
                      ...i,
                      name: alt.name,
                      price: Number(alt.price) || i.price,
                      why: `Swapped: ${alt.tradeoff}`,
                      alternatives: i.alternatives.filter(
                        (a) => a.name !== alt.name,
                      ),
                    }
                  : i,
              ),
            );
            toast.success(`Swapped to ${alt.name}`);
            setSwapTarget(null);
          }}
          onClose={() => setSwapTarget(null)}
        />
      )}
      {compareTarget && (
        <PriceCompareModal
          item={compareTarget}
          onClose={() => setCompareTarget(null)}
        />
      )}
      {showSaved && (
        <SavedModal
          saves={saves}
          onLoad={handleLoadSave}
          onDelete={handleDeleteSave}
          onClose={() => setShowSaved(false)}
        />
      )}

      {/* Layout */}
      <div className="G" />
      <div className="GL" />
      <Topbar
        auth={auth}
        page={page}
        setPage={setPage}
        saves={saves}
        setShowSaved={setShowSaved}
      />

      {/* Pages */}
      {page === PAGES.LANDING && (
        <Landing setPage={setPage} setQi={setQi} setAns={setAns} />
      )}
      {page === PAGES.AUTH && <Auth auth={auth} setPage={setPage} />}
      {page === PAGES.QUIZ && (
        <Quiz
          qi={qi}
          setQi={setQi}
          ans={ans}
          setAns={setAns}
          genErr={genErr}
          setGenErr={setGenErr}
          canGo={canGo}
          goNext={goNext}
          goBack={goBack}
          startGenerate={startGenerate}
          setPage={setPage}
        />
      )}
      {page === PAGES.GEN && <Generating genMsg={genMsg} />}
      {page === PAGES.RESULTS && setup && (
        <Results
          setup={setup}
          items={items}
          setItems={setItems}
          ans={ans}
          saves={saves}
          setSaves={setSaves}
          setSwapTarget={setSwapTarget}
          setCompareTarget={setCompareTarget}
          setPage={setPage}
          setQi={setQi}
          setAns={setAns}
          setSetup={setSetup}
          setCarted={setCarted}
          carted={carted}
          copied={copied}
          setCopied={setCopied}
          startGenerate={startGenerate}
          goLanding={goLanding}
        />
      )}
    </>
  );
}
