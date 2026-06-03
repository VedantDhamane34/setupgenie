import { useState, useEffect } from "react";

export default function Confetti() {
  const [particles, setParticles] = useState(()=>
    Array.from({length:32},(_,i)=>({
      id:i,
      x: Math.random()*100,
      color:["#38bdf8","#818cf8","#34d399","#fbbf24","#f87171","#a78bfa"][i%6],
      size: 4+Math.random()*6,
      delay: Math.random()*0.8,
      duration: 1.5+Math.random()*1.5,
      rotate: Math.random()*360,
    }))
  );

  useEffect(()=>{
    const t = setTimeout(()=>setParticles([]), 3200);
    return ()=>clearTimeout(t);
  },[]);

  if (!particles.length) return null;

  return (
    <div className="confetti-wrap" aria-hidden="true">
      {particles.map(p=>(
        <div key={p.id} className="confetti-p" style={{
          left:`${p.x}%`,
          background:p.color,
          width:p.size,
          height:p.size,
          animationDelay:`${p.delay}s`,
          animationDuration:`${p.duration}s`,
          transform:`rotate(${p.rotate}deg)`,
          borderRadius: p.id%3===0?"50%":p.id%3===1?"2px":"50% 0",
        }}/>
      ))}
    </div>
  );
}