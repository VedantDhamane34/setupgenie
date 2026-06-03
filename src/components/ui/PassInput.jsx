import { useState } from "react";

export default function PassInput({ value, onChange, onEnter, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="pass-wrap">
      <input
        className="AIN"
        type={show ? "text" : "password"}
        placeholder={placeholder || "Min 6 characters"}
        value={value}
        onChange={onChange}
        onKeyDown={e => e.key === "Enter" && onEnter?.()}
      />
      <button className="pass-eye" onClick={()=>setShow(s=>!s)} type="button">
        {show ? "🙈" : "👁️"}
      </button>
    </div>
  );
}