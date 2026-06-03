import { fmtINR } from "../../utils/format";

export default function SwapModal({ item, onSwap, onClose }) {
  if (!item) return null;
  return (
    <div className="ovl" onClick={onClose} role="dialog" aria-modal="true">
      <div className="mdl" onClick={e=>e.stopPropagation()}>
        <div className="mhd">
          <div>
            <div className="mt">Swap: {item.name}</div>
            <div className="msub">Current: ₹{Number(item.price||0).toLocaleString("en-IN")}</div>
          </div>
          <button className="mcl" onClick={onClose}>✕</button>
        </div>
        {!item.alternatives?.length
          ? <div className="mem">No alternatives available.</div>
          : item.alternatives.map((a,i)=>(
            <button key={i} className="sac" onClick={()=>{onSwap(item,a);onClose();}}>
              <div>
                <div className="san">{a.name}</div>
                <div className="sat">{a.tradeoff}</div>
              </div>
              <div className="sar">
                <span className={`sap ${a.price<item.price?"chp":a.price>item.price?"exp":"eq"}`}>
                  ₹{Number(a.price).toLocaleString("en-IN")}
                </span>
                <span className="sad">
                  {a.price<item.price?`Save ${fmtINR(item.price-a.price)}`
                    :a.price>item.price?`+${fmtINR(a.price-item.price)}`
                    :"Same price"}
                </span>
              </div>
            </button>
          ))
        }
      </div>
    </div>
  );
}