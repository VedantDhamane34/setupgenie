import { useState, useEffect } from "react";

let _toastId = 0;
let _setToasts = null;

export const toast = {
  show(msg, type="info", duration=3000) {
    if (!_setToasts) return;
    const id = ++_toastId;
    _setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => _setToasts(t => t.filter(x => x.id !== id)), duration);
  },
  success(msg) { this.show(msg, "success"); },
  error(msg)   { this.show(msg, "error", 4000); },
  info(msg)    { this.show(msg, "info"); },
};

export function useToast() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    _setToasts = setToasts;
    return () => { _setToasts = null; };
  }, []);
  return toasts;
}