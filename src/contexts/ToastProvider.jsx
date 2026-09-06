import { useState, useCallback } from "react";
import { ToastContext } from "./ToastContext";

let idCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((type, message, duration = 3500) => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => dismissToast(id), duration);
  }, [dismissToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast toast-top toast-center z-100 gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`alert cursor-pointer shadow-lg ${
              t.type === "success"
                ? "alert-success"
                : t.type === "error"
                ? "alert-error"
                : "alert-info"
            }`}
            onClick={() => dismissToast(t.id)}
          >
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};