export default function ScoreBar({ label, value }) {
  const col = value>=80
    ?"linear-gradient(90deg,var(--g),#059669)"
    :value>=60
    ?"linear-gradient(90deg,var(--acc),var(--a2))"
    :"linear-gradient(90deg,var(--warn),#ef4444)";

  return (
    <div className="scr">
      <span className="scl">{label}</span>
      <div className="scbg">
        <div className="scf" style={{width:`${value}%`, background:col}}/>
      </div>
      <span className="scn">{value}</span>
    </div>
  );
}