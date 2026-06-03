export function fmtINR(v) {
  if (!v && v !== 0) return "₹0";
  if (v >= 100000) return `₹${(v/100000).toFixed(v%100000===0?0:1)}L`;
  if (v >= 1000)   return `₹${(v/1000).toFixed(v%1000===0?0:1)}K`;
  return `₹${v}`;
}

export function extractJSON(text) {
  if (!text || typeof text !== "string") return null;
  const strategies = [
    () => { const m=text.match(/```(?:json)?\n?([\s\S]*?)\n?```/i); return m?JSON.parse(m[1].trim()):null; },
    () => { const m=text.match(/```\s*([\s\S]*?)\s*```/); return m?JSON.parse(m[1].trim()):null; },
    () => JSON.parse(text.trim()),
    () => { const s=text.indexOf("{"),e=text.lastIndexOf("}"); return s>-1&&e>s?JSON.parse(text.slice(s,e+1)):null; },
    () => { const m=text.match(/\{[\s\S]*\}/); return m?JSON.parse(m[0]):null; },
  ];
  for (const fn of strategies) {
    try { const r=fn(); if(r&&typeof r==="object") return r; } catch {}
  }
  return null;
}