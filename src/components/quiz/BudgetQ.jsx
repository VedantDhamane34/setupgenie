import { useState, useEffect } from "react";
import { fmtINR } from "../../utils/format";

export default function BudgetQ({ step, value, onChange }) {
  const [raw, setRaw] = useState(String(value||step.def));
  const pct = Math.min(((value-step.min)/(step.max-step.min))*100, 100);

  useEffect(()=>{ setRaw(String(value||step.def)); }, [value]);

  const hint = value<15000?"⚡ Every rupee maximised"
    :value<40000?"✅ Good quality all-round"
    :value<100000?"🔥 Premium territory"
    :"👑 Best of everything";

  function set(v) { onChange(v); setRaw(String(v)); }
  function handleRaw(s) {
    const c = s.replace(/[^0-9]/g,"");
    setRaw(c);
    const n = parseInt(c, 10);
    if (!isNaN(n) && n > 0) onChange(Math.min(Math.max(n, step.min), step.max));
  }

  return (
    <div className="bw">
      <div className="bps">
        {step.presets.map(p=>(
          <button key={p.l} className={`bp${value===p.v?" on":""}`} onClick={()=>set(p.v)}>
            <span>{p.e}</span>
            <span className="bpl">{p.l}</span>
            <span className="bpv">{fmtINR(p.v)}</span>
          </button>
        ))}
      </div>
      <div className="bd">
        <span className="br">₹</span>
        <input className="bi" type="text" inputMode="numeric"
          value={raw} onChange={e=>handleRaw(e.target.value)} placeholder="Enter amount"/>
      </div>
      <div className="bt">
        <div className="bf" style={{width:`${pct}%`}}/>
        <input type="range" className="ri" min={step.min} max={step.max} step={step.step}
          value={Math.min(value,step.max)} onChange={e=>{const v=+e.target.value;set(v);}}/>
      </div>
      <div className="blr"><span>{fmtINR(step.min)}</span><span>{fmtINR(step.max)}+</span></div>
      <div className="bh">{hint}</div>
    </div>
  );
}