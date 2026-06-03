import { PAGES } from "../../constants/pages";
import { storage } from "../../utils/storage";
import { fmtINR } from "../../utils/format";

export default function Topbar({ auth, page, setPage, saves, setShowSaved }) {
  return (
    <div className="TB">
      <div className="LG" onClick={()=>setPage(PAGES.LANDING)} role="button" aria-label="SetupGenie Home">
        <div className="LI">⚡</div>
        <span className="LT">SetupGenie</span>
        <span className="LB">BETA</span>
      </div>
      <div className="TBR">
        {saves?.length > 0 && (
          <button className="TB1" onClick={()=>setShowSaved(true)}>
            💾 Saved ({saves.length})
          </button>
        )}
        {auth.user ? (
          <>
            <span style={{fontSize:12,color:"var(--sub)"}}>
              Hi, {(auth.user.name||auth.user.email||"User").split(" ")[0]}
            </span>
            <button className="AV" title="Click to logout" onClick={auth.logout}>
              {auth.user.av||"?"}
            </button>
          </>
        ) : page !== PAGES.AUTH ? (
          <>
            <button className="TB1" onClick={()=>setPage(PAGES.AUTH)}>Sign In</button>
            <button className="TB2" onClick={()=>setPage(PAGES.AUTH)}>Join Free</button>
          </>
        ) : null}
      </div>
    </div>
  );
}