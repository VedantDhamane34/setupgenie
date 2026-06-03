import { PAGES } from "../constants/pages";
import { fmtINR } from "../utils/format";
import { encodeShare } from "../utils/share";
import { storage } from "../utils/storage";
import { toast } from "../hooks/useToast";
import ScoreBar from "../components/results/ScoreBar";
import BudgetBreakdown from "../components/results/BudgetBreakdown";
import ItemCard from "../components/results/ItemCard";

export default function Results({
  setup, items, setItems, ans,
  saves, setSaves,
  setSwapTarget, setCompareTarget,
  setPage, setQi, setAns,
  setSetup, setCarted, carted,
  copied, setCopied,
  startGenerate, goLanding,
}) {
  if (!setup) return null;

  const totalSpent = items.reduce((s,i)=>s+i.price, 0);
  const leftover = (ans.budget||0) - totalSpent;

  function handleSwap(item, alt) {
    setItems(prev=>prev.map(i=>
      i===item ? {...i, name:alt.name, price:Number(alt.price)||i.price,
        why:`Swapped: ${alt.tradeoff}`,
        alternatives:i.alternatives.filter(a=>a.name!==alt.name)} : i
    ));
    toast.success(`Swapped to ${alt.name}`);
  }

  function handleCopy() {
    const url = encodeShare(setup, ans);
    navigator.clipboard?.writeText(url)
      .then(()=>{ toast.success("Share link copied!"); setCopied(true); setTimeout(()=>setCopied(false),2500); })
      .catch(()=>toast.error("Couldn't copy — try manually"));
  }

  function handleCart() {
    if (carted) return;
    setCarted(true);
    items.forEach((item,i)=>{
      setTimeout(()=>{
        try {
          window.open(
            `https://www.amazon.in/s?k=${encodeURIComponent(item.amazonSearch)}&tag=setupgenie-21`,
            "_blank"
          );
        } catch {}
      }, i*700);
    });
    toast.info(`Opening ${items.length} Amazon searches — allow popups if blocked`);
  }

  function handleSave() {
    if (!setup) return;
    const existing = (saves||[]).find(s =>
      s.setup?.headline === setup.headline && Math.abs(Date.now()-s.id) < 5000
    );
    if (existing) { toast.info("Already saved!"); return; }
    const newSave = { id:Date.now(), setup, answers:ans, date:new Date().toLocaleDateString("en-IN") };
    const updated = [newSave, ...(saves||[]).slice(0,9)];
    storage.set("sg_saves", updated);
    setSaves(updated);
    toast.success("Setup saved! ✓");
  }

  function handleDeleteSave(id, e) {
    e.stopPropagation();
    const updated = saves.filter(s=>s.id!==id);
    storage.set("sg_saves", updated);
    setSaves(updated);
    toast.info("Setup deleted");
  }

  return (
    <div className="PG">
      {/* Hero */}
      <div className="RH">
        <div className="RBG">✦ AI-Generated · Personalised for You</div>
        <h2 className="RHH">{setup.headline}</h2>
        <p className="RTG">{setup.tagline}</p>
        <p className="RSM">{setup.summary}</p>
        <div className="BST">
          <div className="BS">
            <div className="BSL">Your Budget</div>
            <div className="BSV">{fmtINR(ans.budget)}</div>
          </div>
          <div className="BS">
            <div className="BSL">Setup Cost</div>
            <div className="BSV">{fmtINR(totalSpent)}</div>
            <div className="BSS">{setup.budgetBreakdown}</div>
          </div>
          {leftover>0 && (
            <div className="BS">
              <div className="BSL">Leftover</div>
              <div className="BSV g">{fmtINR(leftover)}</div>
              <div className="BSS">buffer</div>
            </div>
          )}
        </div>
      </div>

      {/* Score */}
      {setup.setupScore && (
        <div className="SC">
          <div className="SCT">Setup Score</div>
          {Object.entries(setup.setupScore).map(([k,v])=>(
            <ScoreBar key={k} label={k.charAt(0).toUpperCase()+k.slice(1)} value={Number(v)}/>
          ))}
        </div>
      )}

      {/* Budget Breakdown */}
      <BudgetBreakdown items={items} budget={ans.budget||1}/>

      {/* Items */}
      <div className="SHD">🛍️ Complete Setup · {items.length} items</div>
      {items.length===0 ? (
        <div className="empty-state">
          <div className="es-icon">🤔</div>
          <div className="es-title">No items generated</div>
          <div className="es-sub">Try again with a higher budget or different selections.</div>
          <button className="es-btn" onClick={goLanding}>← Try Again</button>
        </div>
      ) : (
        <div className="ICS">
          {items.map((item,i)=>(
            <ItemCard key={i} item={item}
              onSwap={setSwapTarget}
              onCompare={setCompareTarget}/>
          ))}
        </div>
      )}

      {/* Info Cards */}
      {setup.savingsNote && (
        <div className="IC">
          <div className="ICH">💡 Smart Buy Note</div>
          <div className="ICT g">{setup.savingsNote}</div>
        </div>
      )}
      {setup.easyWins && (
        <div className="IC">
          <div className="ICH">⚡ Free Wins — Do These Today</div>
          <div className="ICT">{setup.easyWins}</div>
        </div>
      )}
      {setup.whatToSkip && (
        <div className="IC" style={{borderColor:"rgba(249,115,22,.16)"}}>
          <div className="ICH" style={{color:"var(--warn)"}}>🚫 Don't Waste Money On</div>
          <div className="ICT w">{setup.whatToSkip}</div>
        </div>
      )}
      {setup.proTips?.length>0 && (
        <div className="TC">
          <div className="TH">⚡ Pro Tips for Your Setup</div>
          {setup.proTips.map((t,i)=>(
            <div key={`tip-${i}`} className="TI">
              <span className="TN">{i+1}.</span><span>{t}</span>
            </div>
          ))}
        </div>
      )}
      {setup.upgradeNext && (
        <div className="IC" style={{borderColor:"rgba(129,140,248,.18)"}}>
          <div className="ICH" style={{color:"var(--a2)"}}>🚀 Next Upgrade When Budget Allows</div>
          <div className="ICT">{setup.upgradeNext}</div>
        </div>
      )}

      {/* Actions */}
      <div className="CSC">
        <button className={`CB${carted?" done":""}`} onClick={handleCart}>
          {carted?`✓ Opened ${items.length} Amazon searches`:"🛒 Shop Full Setup on Amazon India"}
        </button>
        <div className="ACR">
          <button className={`ACB${copied?" cp":""}`} onClick={handleCopy}>
            {copied?"✓ Copied!":"🔗 Share Link"}
          </button>
          <button className="ACB" onClick={()=>window.print()}>📋 Save PDF</button>
          <button className="ACB" onClick={handleSave}>💾 Save Setup</button>
        </div>
        <div className="ACR" style={{marginTop:0}}>
          <button className="ACB" onClick={()=>{ setPage(PAGES.QUIZ); setQi(9); }}>
            ✏️ Edit Answers
          </button>
          <button className="ACB" onClick={()=>{ setCarted(false); startGenerate(ans); }}>
            🔄 Rebuild Setup
          </button>
        </div>
        <button className="RB" onClick={goLanding}>↺ Start Over</button>
      </div>
    </div>
  );
}