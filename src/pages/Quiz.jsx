import { QUIZ_STEPS } from "../constants/quiz";
import { PAGES } from "../constants/pages";
import MultiQ from "../components/quiz/MultiQ";
import CardQ from "../components/quiz/CardQ";
import VibeQ from "../components/quiz/VibeQ";
import BudgetQ from "../components/quiz/BudgetQ";
import SliderQ from "../components/quiz/SliderQ";
import RankQ from "../components/quiz/RankQ";

export default function Quiz({
  qi, setQi, ans, setAns,
  genErr, setGenErr,
  canGo, goNext, goBack,
  startGenerate, setPage,
}) {
  const step = QUIZ_STEPS[qi];
  const progress = (qi / QUIZ_STEPS.length) * 100;

  function toggleMulti(v, excl) {
    setAns(a=>{
      const cur = a[step.id]||[];
      if (excl) return {...a,[step.id]:[v]};
      const filtered = cur.filter(x=>!step.opts.find(o=>o.v===x)?.excl);
      return {...a,[step.id]:filtered.includes(v)?filtered.filter(x=>x!==v):[...filtered,v]};
    });
  }

  if (!step) return null;

  return (
    <div className="PG">
      <div className="QPG">
        {/* Nav */}
        <div className="QNV">
          <button className="QBK" onClick={goBack}>← Back</button>
          <div className="QDS">
            {QUIZ_STEPS.map((_,i)=>(
              <div key={i} className={`QD${i<qi?" dn":i===qi?" ac":" pd"}`}/>
            ))}
          </div>
          <span className="QCT">{qi+1}/{QUIZ_STEPS.length}</span>
        </div>

        {/* Progress */}
        <div className="QP"><div className="QPF" style={{width:`${progress}%`}}/></div>

        {/* Error */}
        {genErr && (
          <div className="QE">
            ⚠️ {genErr} —
            <button
              style={{background:"none",border:"none",color:"var(--acc)",cursor:"pointer",fontSize:13}}
              onClick={()=>{ setGenErr(""); startGenerate(ans); }}>
              Retry →
            </button>
          </div>
        )}

        {/* Question — key={qi} forces remount for animations */}
        <div key={qi} style={{animation:"slideInRight .35s cubic-bezier(.22,1,.36,1) both"}}>
          <span className="QEM">{step.emoji}</span>
          <h2 className="QT">{step.q}</h2>
          {step.hint && <p className="QH">{step.hint}</p>}

          {step.type==="multi" && (
            <MultiQ step={step} value={ans[step.id]||[]}
              onChange={v=>setAns(a=>({...a,[step.id]:v}))}/>
          )}
          {step.type==="card" && (
            <CardQ step={step} value={ans[step.id]}
              onChange={v=>{
                const next={...ans,[step.id]:v};
                setAns(next);
                setTimeout(()=>goNext(next), 300);
              }}/>
          )}
          {step.type==="vibe" && (
            <VibeQ step={step} value={ans[step.id]}
              onChange={v=>{
                const next={...ans,[step.id]:v};
                setAns(next);
                setTimeout(()=>goNext(next), 300);
              }}/>
          )}
          {step.type==="budget" && (
            <BudgetQ step={step} value={ans[step.id]??step.def}
              onChange={v=>setAns(a=>({...a,[step.id]:v}))}/>
          )}
          {step.type==="slider" && (
            <SliderQ step={step} value={ans[step.id]??step.def}
              onChange={v=>setAns(a=>({...a,[step.id]:v}))}/>
          )}
          {step.type==="rank" && (
            <RankQ step={step} value={ans[step.id]}
              onChange={v=>setAns(a=>({...a,[step.id]:v}))}/>
          )}

          {/* Continue button */}
          {(step.type==="multi"||step.type==="budget"||step.type==="slider"||step.type==="rank") && (
            <div className="BN">
              <button className={`CT${canGo?" on":" off"}`}
                onClick={()=>canGo&&goNext()} disabled={!canGo}>
                {step.type==="multi"&&canGo
                  ?`Continue (${(ans[step.id]||[]).length} selected) →`
                  :step.type==="budget"?"Lock in Budget →"
                  :step.type==="rank"?"Set Priorities →"
                  :"Continue →"}
              </button>
              {(step.type==="rank"||(step.type==="multi"&&qi>0)) && (
                <button className="SK" onClick={()=>goNext()}>Skip</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}