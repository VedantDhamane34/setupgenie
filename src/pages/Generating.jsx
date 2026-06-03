import { GEN_MSGS } from "../constants/quiz";

export default function Generating({ genMsg }) {
  return (
    <div className="PG">
      <div className="GNP">
        <div className="GNO">⚡</div>
        <h2 className="GNT">Building Your Setup</h2>
        <p className="GNS">{GEN_MSGS[genMsg]}</p>
        <div className="GNB"><div className="GNBF"/></div>
        <div className="GSL">
          {GEN_MSGS.map((m,i)=>(
            <div key={i} className={`GSI${i<genMsg?" dn":i===genMsg?" ac":""}`}>
              {i<genMsg
                ?<span style={{color:"var(--g)",fontSize:13}}>✓</span>
                :i===genMsg
                ?<span className="GSD"/>
                :<span className="GSP"/>
              }
              {m}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}