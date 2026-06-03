export default function VibeQ({ step, value, onChange }) {
  return (
    <div className="vg">
      {step.opts.map(o => {
        const sel = value === o.v;
        return (
          <button key={o.v} className={`vopt${sel?" on":""}`}
            style={{
              background: sel ? o.bg+"55" : "var(--s1)",
              borderColor: sel ? o.ac : "var(--b1)",
              boxShadow: sel ? `0 6px 20px ${o.ac}33` : undefined
            }}
            onClick={()=>onChange(o.v)}>
            <div className="vsw" style={{background:o.bg, borderColor:o.ac}}/>
            <span className="ve">{o.e}</span>
            <div className="vl">{o.v}</div>
            <div className="vs">{o.s}</div>
          </button>
        );
      })}
    </div>
  );
}