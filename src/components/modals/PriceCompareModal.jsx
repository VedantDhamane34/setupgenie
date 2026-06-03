import { useState, useEffect } from "react";
import { callGroq } from "../../utils/api";
import { extractJSON } from "../../utils/format";

const PLATFORMS = [
  { id:"amazon",   name:"Amazon India",    color:"#ff9900", bg:"rgba(255,153,0,.1)",  icon:"🟠" },
  { id:"flipkart", name:"Flipkart",         color:"#2f74d3", bg:"rgba(47,116,211,.1)", icon:"🔵" },
  { id:"croma",    name:"Croma",            color:"#cc0000", bg:"rgba(204,0,0,.1)",    icon:"🔴" },
  { id:"reliance", name:"Reliance Digital", color:"#1a237e", bg:"rgba(26,35,126,.1)", icon:"🟣" },
  { id:"tatacliq", name:"Tata Cliq",        color:"#7b1fa2", bg:"rgba(123,31,162,.1)",icon:"💜" },
  { id:"vijay",    name:"Vijay Sales",      color:"#e65100", bg:"rgba(230,81,0,.1)",  icon:"🟤" },
];

export default function PriceCompareModal({ item, onClose }) {
  const [state, setState] = useState("loading");
  const [prices, setPrices] = useState([]);
  const [tab, setTab] = useState("compare");

  useEffect(()=>{ if(item) fetchPrices(); },[item]);

  async function fetchPrices() {
    setState("loading");
    try {
      const prompt = `You are a price comparison tool for Indian e-commerce. Output ONLY a valid JSON array. No markdown. Start with [

Product: "${item.name}" (approx Rs ${item.price})

Return prices from: amazon, flipkart, croma, reliance, tatacliq, vijay
Each object: {"platform":"amazon","price":8999,"inStock":true,"deliveryDays":2,"emi":true,"url":""}

Rules: vary prices +-5 to 15%, not all platforms stock all items, use realistic prices.`;

      const raw = await callGroq(prompt, 800);
      const parsed = extractJSON(raw);
      if (!Array.isArray(parsed)) throw new Error("Not an array");

      const enriched = parsed.map(p => {
        const meta = PLATFORMS.find(pl=>pl.id===p.platform) || PLATFORMS[0];
        const q = encodeURIComponent(item.amazonSearch || item.name);
        const urls = {
          amazon:   `https://www.amazon.in/s?k=${q}&tag=setupgenie-21`,
          flipkart: `https://www.flipkart.com/search?q=${q}`,
          croma:    `https://www.croma.com/search?q=${q}`,
          reliance: `https://www.reliancedigital.in/search?q=${q}`,
          tatacliq: `https://www.tatacliq.com/search/?searchCategory=all&text=${q}`,
          vijay:    `https://www.vijaysales.com/search/${q}`,
        };
        return { ...p, ...meta, buyUrl: urls[p.platform]||"#" };
      });

      enriched.sort((a,b)=>{
        if(a.inStock&&!b.inStock) return -1;
        if(!a.inStock&&b.inStock) return 1;
        return a.price - b.price;
      });

      setPrices(enriched);
      setState("done");
    } catch(e) {
      console.error("Price compare error:", e);
      setState("error");
    }
  }

  if (!item) return null;
  const cheapest = prices.find(p=>p.inStock);
  const savings = cheapest ? item.price - cheapest.price : 0;

  return (
    <div className="ovl" onClick={onClose}>
      <div className="pcmdl" onClick={e=>e.stopPropagation()}>
        <div className="pcmhd">
          <div className="pcminfo">
            <span className="pcmico">{item.categoryIcon}</span>
            <div>
              <div className="pcmname">{item.name}</div>
              <div className="pcmsub">AI Recommended: ₹{Number(item.price||0).toLocaleString("en-IN")}</div>
            </div>
          </div>
          <button className="mcl" onClick={onClose}>✕</button>
        </div>

        <div className="pctabs">
          <button className={`pctab${tab==="compare"?" on":""}`} onClick={()=>setTab("compare")}>
            🏪 Compare Prices
          </button>
          <button className={`pctab${tab==="alternatives"?" on":""}`} onClick={()=>setTab("alternatives")}>
            🔄 Alternatives ({item.alternatives?.length||0})
          </button>
        </div>

        {tab==="compare" && (
          <div className="pccontent">
            {state==="loading" && (
              <div className="pcloading">
                <div className="pcspinner">⟳</div>
                <div className="pcloadtxt">Checking prices across platforms…</div>
                <div className="pcloadtxt2">Amazon · Flipkart · Croma · Reliance · Tata Cliq</div>
              </div>
            )}
            {state==="error" && (
              <div className="pcerr">
                <div>⚠️ Couldn't fetch prices</div>
                <button className="pcretry" onClick={fetchPrices}>Retry →</button>
              </div>
            )}
            {state==="done" && (
              <>
                {savings>0 && cheapest && (
                  <div className="pcsave">
                    🏆 Best price on <strong>{cheapest.name}</strong> — ₹{cheapest.price.toLocaleString("en-IN")} · saves ₹{savings.toLocaleString("en-IN")}
                  </div>
                )}
                <div className="pctable">
                  <div className="pcthr">
                    <span>Platform</span><span>Price</span><span>Delivery</span><span>Action</span>
                  </div>
                  {prices.map((p,i)=>(
                    <div key={i} className={`pcrow${!p.inStock?" oos":""}`}>
                      <div className="pcplat">
                        <span style={{fontSize:16}}>{p.icon}</span>
                        <div>
                          <div className="pcpname" style={{color:p.color}}>{p.name}</div>
                          {p.emi&&p.inStock&&<div className="pcemi">EMI available</div>}
                        </div>
                      </div>
                      <div className="pcprice">
                        {p.inStock ? (
                          <>
                            <span className={`pcamt${i===0&&p.inStock?" cheapest":""}`}>
                              ₹{p.price.toLocaleString("en-IN")}
                            </span>
                            {i===0&&<span className="pcbest">BEST</span>}
                            {p.price>item.price&&<span className="pcmore">+₹{(p.price-item.price).toLocaleString("en-IN")}</span>}
                            {p.price<item.price&&<span className="pcsavebdg">-₹{(item.price-p.price).toLocaleString("en-IN")}</span>}
                          </>
                        ) : <span className="pcoostxt">Out of Stock</span>}
                      </div>
                      <div className="pcdelivery">{p.inStock?`${p.deliveryDays}d`:"—"}</div>
                      <div className="pcaction">
                        {p.inStock
                          ? <a className="pcbuy" style={{background:p.bg,borderColor:p.color,color:p.color}} href={p.buyUrl} target="_blank" rel="noopener noreferrer">Buy →</a>
                          : <span className="pcoosBtn">Unavailable</span>
                        }
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pcnote">⚡ Prices are AI-estimated. Phase 2 will show live prices.</div>
              </>
            )}
          </div>
        )}

        {tab==="alternatives" && (
          <div className="pccontent">
            {!item.alternatives?.length
              ? <div className="mem">No alternatives for this item.</div>
              : <>
                <div className="altcur">
                  <span className="altcurlbl">Currently Selected</span>
                  <div className="altcurrow">
                    <span className="altcurname">{item.name}</span>
                    <span className="altcurprice">₹{item.price.toLocaleString("en-IN")}</span>
                  </div>
                </div>
                <div className="altslist">
                  {item.alternatives.map((a,i)=>{
                    const diff = Number(a.price)-item.price;
                    return (
                      <div key={i} className="altcard">
                        <div className="altcard-top">
                          <div className="altcard-left">
                            <div className="altcard-name">{a.name}</div>
                            <div className="altcard-trade">💬 {a.tradeoff}</div>
                          </div>
                          <div className="altcard-right">
                            <div className={`altcard-price ${diff<0?"chp":"exp"}`}>
                              ₹{Number(a.price).toLocaleString("en-IN")}
                            </div>
                            <div className={`altcard-diff ${diff<0?"chp":"exp"}`}>
                              {diff<0?`Save ₹${Math.abs(diff).toLocaleString("en-IN")}`:`+₹${diff.toLocaleString("en-IN")}`}
                            </div>
                          </div>
                        </div>
                        <div className="altcard-links">
                          <a className="altbuy az" href={`https://www.amazon.in/s?k=${encodeURIComponent(a.name)}&tag=setupgenie-21`} target="_blank" rel="noopener noreferrer">🛒 Amazon</a>
                          <a className="altbuy fk" href={`https://www.flipkart.com/search?q=${encodeURIComponent(a.name)}`} target="_blank" rel="noopener noreferrer">🛍️ Flipkart</a>
                          <a className="altbuy cr" href={`https://www.croma.com/search?q=${encodeURIComponent(a.name)}`} target="_blank" rel="noopener noreferrer">🔴 Croma</a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            }
          </div>
        )}
      </div>
    </div>
  );
}