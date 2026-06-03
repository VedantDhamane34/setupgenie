import { useState } from "react";

export default function ItemCard({ item, onSwap, onCompare }) {
  const [open, setOpen] = useState(false);
  const ptClass = item.priority==="Must Have"?"must"
    :item.priority==="Highly Recommended"?"high":"nice";

  return (
    <div className={`ic${open?" op":""}`}>
      <div className="ict" onClick={()=>setOpen(!open)}>
        <span className="ico">{item.categoryIcon}</span>
        <div className="icf">
          <div className="icc">{item.category}</div>
          <div className="icn">{item.name}</div>
        </div>
        <div className="icr">
          <div className="icp">₹{item.price.toLocaleString("en-IN")}</div>
          <span className={`pt ${ptClass}`}>{item.priority}</span>
        </div>
        <span className="ich">{open?"▲":"▼"}</span>
      </div>

      {open && (
        <div className="icb">
          {item.why && <div className="icw">💬 {item.why}</div>}
          <div className="ictags">
            {item.solves && <span className="itg sol">✅ {item.solves}</span>}
            {item.vibeNote && <span className="itg vib">🎨 {item.vibeNote}</span>}
          </div>

          {/* Buy Platforms */}
          <div className="buy-section">
            <div className="buy-section-title">🛒 Buy from</div>
            <div className="buy-platforms">
              {[
                { key:"amazon",   label:"Amazon India",    tag:"Fast delivery · EMI",          icon:"🟠", cls:"amazon",   url:`https://www.amazon.in/s?k=${encodeURIComponent(item.amazonSearch)}&tag=setupgenie-21` },
                { key:"flipkart", label:"Flipkart",         tag:"SuperCoin · No Cost EMI",      icon:"🔵", cls:"flipkart", url:`https://www.flipkart.com/search?q=${encodeURIComponent(item.flipkartSearch)}` },
                { key:"croma",    label:"Croma",            tag:"Try in store · Easy returns",  icon:"🔴", cls:"croma",    url:`https://www.croma.com/search?q=${encodeURIComponent(item.amazonSearch)}` },
                { key:"reliance", label:"Reliance Digital", tag:"ResQ service · Offline too",   icon:"🟣", cls:"reliance", url:`https://www.reliancedigital.in/search?q=${encodeURIComponent(item.amazonSearch)}` },
                { key:"tatacliq", label:"Tata Cliq",        tag:"Tata Pay · Cashback",          icon:"💜", cls:"tatacliq", url:`https://www.tatacliq.com/search/?searchCategory=all&text=${encodeURIComponent(item.amazonSearch)}` },
              ].map(p=>(
                <a key={p.key} className={`buy-platform-btn ${p.cls}`}
                  href={p.url} target="_blank" rel="noopener noreferrer"
                  onClick={e=>e.stopPropagation()}>
                  <span className="bpb-icon">{p.icon}</span>
                  <div className="bpb-info">
                    <div className="bpb-name">{p.label}</div>
                    <div className="bpb-tag">{p.tag}</div>
                  </div>
                  <span className="bpb-arr">→</span>
                </a>
              ))}
            </div>
          </div>

          {/* Alternatives */}
          {item.alternatives?.length>0 && (
            <div className="alts">
              <div className="altl">Alternatives ({item.alternatives.length})</div>
              {item.alternatives.map((a,i)=>(
                <div key={i} className="altr">
                  <span className="aln">{a.name}</span>
                  <div className="alri">
                    <span className="alp">₹{Number(a.price).toLocaleString("en-IN")}</span>
                    <span className="alt2">{a.tradeoff}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="ilinks">
            <button className="lnk cp" onClick={e=>{e.stopPropagation();onCompare(item);}}>
              📊 Compare Prices
            </button>
            <button className="lnk sw" onClick={e=>{e.stopPropagation();onSwap(item);}}>
              🔄 Swap Item
            </button>
          </div>
        </div>
      )}
    </div>
  );
}