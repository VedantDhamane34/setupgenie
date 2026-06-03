import { PAGES } from "../constants/pages";

export default function Landing({ setPage, setQi, setAns }) {
  function startQuiz() {
    setQi(0);
    setAns({});
    setPage(PAGES.QUIZ);
  }

  return (
    <div className="PG">
      <div className="LD">
        <div className="LDG"><span className="LDOT"/>AI-Powered · India-First · Free</div>
        <h1 className="LH">
          <span className="LP">Your Perfect</span>
          <span className="LGR">WFH Setup.</span>
        </h1>
        <p className="LS">
          Tell us your exact budget, role, space, and pain points. Our AI builds a complete
          personalised workspace — monitor to mood lighting — with real 2026 Indian market
          prices. Swap items, save setups, share with friends, shop in one click.
        </p>
        <div className="LFS">
          {["🤖 AI-Personalised","💡 All Categories Covered","🛒 One-Click Shop",
            "🇮🇳 Real Indian Prices","🎯 Exact Budget","💾 Save & Share",
            "🔄 Swap Any Item","📊 Price Comparison"].map(f=>(
            <div key={f} className="LF">{f}</div>
          ))}
        </div>
        <div className="LCTS">
          <button className="CM" onClick={startQuiz}>
            Build My Setup <span className="AR">→</span>
          </button>
          <button className="CS" onClick={()=>setPage(PAGES.AUTH)}>
            Create Account
          </button>
        </div>
        <div className="LST">
          {[
            {n:"🚀", l:"Be among the first"},
            {n:"🇮🇳", l:"Built for India"},
            {n:"⚡", l:"Free during Beta"},
          ].map(s=>(
            <div key={s.l} className="LSB">
              <span className="LSN" style={{fontSize:28}}>{s.n}</span>
              <div className="LSL">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}