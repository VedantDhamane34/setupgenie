import { useState } from "react";
import { PAGES } from "../constants/pages";
import PassInput from "../components/ui/PassInput";
import { toast } from "../hooks/useToast";

export default function Auth({ auth, setPage }) {
  const [tab, setTab] = useState("login");
  const [fields, setFields] = useState({name:"", email:"", pass:""});
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  function handleAuth() {
    setErr(""); setLoading(true);
    setTimeout(()=>{
      const ok = tab==="login"
        ? auth.login(fields.email, fields.pass)
        : auth.signup(fields.name, fields.email, fields.pass);
      if (ok) {
        toast.success(tab==="login"?"Welcome back!":"Account created! Welcome 👋");
        setFields({name:"", email:"", pass:""});
        setPage(PAGES.LANDING);
      } else {
        setErr(tab==="login"
          ?"Check your credentials"
          :"Fill all fields (password min 6 chars)");
      }
      setLoading(false);
    }, 600);
  }

  return (
    <div className="PG">
      <div className="APG">
        <div className="ALG">
          <div className="LI" style={{width:38,height:38,borderRadius:11,fontSize:18}}>⚡</div>
          <span className="LT" style={{fontSize:21}}>SetupGenie</span>
        </div>
        <div className="AC">
          <div className="ATS">
            {["login","signup"].map(t=>(
              <button key={t} className={`AT${tab===t?" on":""}`}
                onClick={()=>{setTab(t);setErr("")}}>
                {t==="login"?"Sign In":"Create Account"}
              </button>
            ))}
          </div>
          <h2 className="ATT">{tab==="login"?"Welcome back 👋":"Join SetupGenie 🚀"}</h2>
          <p className="ATS2">
            {tab==="login"
              ?"Access saved setups and price alerts"
              :"Save setups, get shareable links, track prices"}
          </p>
          {err && <div className="AE">⚠️ {err}</div>}
          <div className="AFL">
            {tab==="signup" && (
              <div className="AFL2">
                <label className="ALL">Full Name</label>
                <input className="AIN" type="text" placeholder="Your name"
                  value={fields.name} onChange={e=>setFields(f=>({...f,name:e.target.value}))}/>
              </div>
            )}
            <div className="AFL2">
              <label className="ALL">Email</label>
              <input className="AIN" type="email" placeholder="you@email.com"
                value={fields.email} onChange={e=>setFields(f=>({...f,email:e.target.value}))}
                onKeyDown={e=>e.key==="Enter"&&handleAuth()}/>
            </div>
            <div className="AFL2">
              <label className="ALL">Password</label>
              <PassInput value={fields.pass}
                onChange={e=>setFields(f=>({...f,pass:e.target.value}))}
                onEnter={handleAuth}/>
            </div>
          </div>
          <button className="ASB" onClick={handleAuth} disabled={loading}>
            {loading?<span className="spin">◌</span>
              :tab==="login"?"Sign In →":"Create Account →"}
          </button>
          <div className="ADV"><span>or</span></div>
          <button className="AGG">
            <span className="GC">G</span>Continue with Google
          </button>
          <button className="ASK" onClick={()=>setPage(PAGES.QUIZ)}>
            Continue without account →
          </button>
          <p className="ASW">
            {tab==="login"?"No account? ":"Have one? "}
            <button className="ALK" onClick={()=>setTab(tab==="login"?"signup":"login")}>
              {tab==="login"?"Sign up free":"Sign in"}
            </button>
          </p>
        </div>
        <div className="AWH">
          <div className="AWT">Why create an account?</div>
          {[
            {i:"💾", t:"Save & revisit your setups anytime"},
            {i:"🔗", t:"Shareable link for your build"},
            {i:"📉", t:"Price drop notifications"},
            {i:"🏆", t:"WFH community leaderboard"},
          ].map(w=>(
            <div key={w.t} className="AWI"><span>{w.i}</span><span>{w.t}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}