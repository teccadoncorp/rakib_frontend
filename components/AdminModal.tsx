"use client";

import { type ReactNode } from "react";

export function AdminModal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="ap-modal-back" role="presentation" onClick={onClose}>
      <div
        className="ap-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ap-modal-head">
          <h3>{title}</h3>
          <button type="button" className="ap-btn ghost" onClick={onClose}>
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
