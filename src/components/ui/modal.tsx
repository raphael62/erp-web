"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type ModalProps = {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  show?: boolean; // optional controlled prop
};

export default function Modal({ title, children, onClose, show = true }: ModalProps) {
  const [mounted, setMounted] = React.useState(false);
  const elRef = React.useRef<HTMLDivElement | null>(null);
  if (!elRef.current) elRef.current = document.createElement("div");

  React.useEffect(() => {
    setMounted(true);
    const el = elRef.current!;
    document.body.appendChild(el);
    return () => {
      document.body.removeChild(el);
    };
  }, []);

  if (!mounted || !show) return null;

  const content = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-[101] w-[95%] max-w-2xl rounded-md bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-base font-semibold">{title}</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded p-1 text-gray-500 hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
          )}
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );

  return createPortal(content, elRef.current);
}

export function ModalFooter({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-end gap-2 border-t px-4 py-3">{children}</div>;
}
