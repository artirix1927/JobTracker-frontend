import { createContext, useContext, useState } from "react";

type ToastType = "success" | "error" | "info";

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const showToast = (message: string, type: ToastType = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div
          className={`
            fixed bottom-6 right-6 px-4 py-2 rounded shadow-lg
            animate-fade-in text-white animate-duration-150
            ${toast.type === "success" && "bg-green-600"}
            ${toast.type === "error" && "bg-red-600"}
            ${toast.type === "info" && "bg-gray-800"}
          `}
        >
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
