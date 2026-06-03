export default function MultiQ({ step, value=[], onChange }) {
  function toggle(v, excl) {
    if (excl) { onChange([v]); return; }
    const cur = value.filter(x => !step.opts.find(o=>o.v===x)?.excl);
    onChange(cur.includes(v) ? cur.filter(x=>x!==v) : [...cur, v]);
  }
  return (
    <div className="mg">
      {step.opts.map(o => {
        const sel = value.includes(o.v);
        return (
          <button key={o.v} className={`mopt${sel?" on":""}`} onClick={()=>toggle(o.v, o.excl)}>
            <div className="mh">
              <span className="me">{o.e}</span>
              <span className={`mc${sel?" on":""}`}>{sel?"✓":""}</span>
            </div>
            <div className="ml">{o.v}</div>
            {o.d && <div className="md">{o.d}</div>}
          </button>
        );
      })}
    </div>
  );
}