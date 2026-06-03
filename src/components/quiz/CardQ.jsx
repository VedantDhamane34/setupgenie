export default function CardQ({ step, value, onChange }) {
  return (
    <div className="cg">
      {step.opts.map(o => (
        <button key={o.v} className={`copt${value===o.v?" on":""}`} onClick={()=>onChange(o.v)}>
          <span className="ce">{o.e}</span>
          <div className="cl">{o.v}</div>
          {o.s && <div className="cs">{o.s}</div>}
          {o.d && <div className="cd">{o.d}</div>}
        </button>
      ))}
    </div>
  );
}