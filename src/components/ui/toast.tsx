import type { ReactNode } from "react";

interface ToastProps {
  message: string;
  icon?: ReactNode;
}

export const Toast = ({ message, icon }: ToastProps) => (
  <output className="bg-text-title/60 rounded-16 text-text-white pointer-events-none fixed inset-x-0 bottom-10 z-30 mx-auto flex w-fit items-center gap-3 px-5 py-3 shadow-sm">
    {icon}
    <span className="body2">{message}</span>
  </output>
);
