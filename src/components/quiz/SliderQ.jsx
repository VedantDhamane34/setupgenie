export default function SliderQ({ step, value, onChange }) {
  const pct = ((value-step.min)/(step.max-step.min))*100;
  const marks = [1,4,8,12,16];
  const desc = value<=3?"Casual — minimal ergonomics"
    :value<=6?"Moderate — comfort matters"
    :value<=10?"Heavy — ergonomics essential"
    :"Marathon — maximum care needed";
  const col = value>=8?"var(--warn)":"var(--g)";

  return (
    <div className="sw">
      <div className="sv">
        <span className="sn" style={{color:"var(--acc)"}}>{value}</span>
        <span className="su">hrs / day</span>
      </div>
      <div className="st">
        <div className="sf" style={{width:`${pct}%`}}/>
        <input type="range" className="ri" min={step.min} max={step.max} step={1}
          value={value} onChange={e=>onChange(+e.target.value)}/>
        {marks.map(m=>(
          <div key={m} className="sm"
            style={{left:`${((m-step.min)/(step.max-step.min))*100}%`}}
            onClick={()=>onChange(m)}/>
        ))}
      </div>
      <div className="sl">{marks.map(m=><span key={m}>{m}h</span>)}</div>
      <div className="sd" style={{color:col,borderColor:col,background:col+"11"}}>{desc}</div>
    </div>
  );
}