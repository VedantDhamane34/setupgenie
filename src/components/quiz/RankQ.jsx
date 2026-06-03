import { useState, useEffect, useRef } from "react";

export default function RankQ({ step, value, onChange }) {
  const [items, setItems] = useState(()=>value?.length?value:step.opts.map(o=>o.v));
  const drag = useRef(null);
  const imap = Object.fromEntries(step.opts.map(o=>[o.v,o.e]));

  useEffect(()=>{ if(value?.length) setItems(value); }, [value]);

  function ds(i) { drag.current = i; }
  function dov(e, i) {
    e.preventDefault();
    if (drag.current===null||drag.current===i) return;
    const n=[...items],[m]=n.splice(drag.current,1);
    n.splice(i,0,m); drag.current=i; setItems(n); onChange(n);
  }
  function de() { drag.current = null; }

  return (
    <div>
      <div className="rt">↕ Drag to reorder · #1 gets the most budget</div>
      {items.map((v,i)=>(
        <div key={v} className="rr" draggable
          onDragStart={()=>ds(i)} onDragOver={e=>dov(e,i)} onDragEnd={de}>
          <span className={`rn${i===0?" g":i===1?" s":i===2?" b":""}`}>{i+1}</span>
          <span className="ri2">{imap[v]}</span>
          <span className="rl">{v}</span>
          <span className="rh">⠿</span>
        </div>
      ))}
    </div>
  );
}