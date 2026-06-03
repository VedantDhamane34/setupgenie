import { useState } from "react";
import { fmtINR } from "../../utils/format";

export default function BudgetBreakdown({ items, budget }) {
  const [open, setOpen] = useState(false);

  const cats = {};
  items.forEach(i=>{
    if (!cats[i.category]) cats[i.category] = {icon:i.categoryIcon, total:0, count:0};
    cats[i.category].total += i.price;
    cats[i.category].count++;
  });
  const total = items.reduce((s,i)=>s+i.price, 0);

  return (
    <div className="bbe">
      <button className="bbt" onClick={()=>setOpen(!open)}>
        <span>💰 Budget Breakdown by Category</span>
        <span>{open?"▲":"▼"}</span>
      </button>
      {open && (
        <div className="bbb">
          {Object.entries(cats).map(([cat,data])=>(
            <div key={cat} className="bbr">
              <span className="bbi">{data.icon}</span>
              <div className="bbinfo">
                <div className="bbn">{cat}</div>
                <div className="bbc">{data.count} item{data.count>1?"s":""}</div>
              </div>
              <div className="bbbg">
                <div className="bbfill" style={{width:`${Math.min((data.total/budget)*100,100)}%`}}/>
              </div>
              <span className="bba">{fmtINR(data.total)}</span>
            </div>
          ))}
          <div className="bbtot">
            <span>Total</span>
            <span style={{color:"var(--acc)"}}>{fmtINR(total)}</span>
          </div>
        </div>
      )}
    </div>
  );
}