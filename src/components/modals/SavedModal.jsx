import { fmtINR } from "../../utils/format";

export default function SavedModal({ saves, onLoad, onDelete, onClose }) {
  return (
    <div className="ovl" onClick={onClose} role="dialog" aria-modal="true">
      <div className="mdl" onClick={e=>e.stopPropagation()}>
        <div className="mhd">
          <div className="mt">💾 Saved Setups</div>
          <button className="mcl" onClick={onClose}>✕</button>
        </div>
        {!saves.length
          ? <div className="mem">No saved setups yet — build one!</div>
          : saves.map(s=>(
            <div key={s.id} className="svc-wrap">
              <button className="svc" onClick={()=>onLoad(s)}>
                <div>
                  <div className="svn">{s.setup.headline}</div>
                  <div className="svm">{s.date} · {fmtINR(s.setup.totalEstimate)}</div>
                </div>
                <span style={{color:"var(--acc)"}}>→</span>
              </button>
              <button className="svc-del" onClick={e=>onDelete(s.id,e)} title="Delete">✕</button>
            </div>
          ))
        }
      </div>
    </div>
  );
}