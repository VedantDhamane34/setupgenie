import { useToast } from "../../hooks/useToast";

export default function ToastContainer() {
  const toasts = useToast();
  if (!toasts.length) return null;
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="toast-icon">
            {t.type==="success"?"✓":t.type==="error"?"⚠":"ℹ"}
          </span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}