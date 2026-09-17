import React, { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';

export interface ContextSurfaceProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  labelledBy?: string;
}

/**
 * Shared interaction shell for contextual details.
 * Desktop: right-side drawer. Mobile: bottom sheet.
 * Content and navigation state stay outside this component so projects,
 * votes and other contextual content reuse the same interaction contract.
 */
export const ContextSurface: React.FC<ContextSurfaceProps> = ({
  open,
  title,
  children,
  onClose,
  labelledBy,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const generatedTitleId = useId();
  const headingId = labelledBy || `context-surface-title-${generatedTitleId}`;

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const root = document.querySelector('[data-context-surface="true"]');
      if (!(root instanceof HTMLElement)) return;

      const focusable = Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => {
        if (element.hasAttribute('aria-hidden')) return false;
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });

      if (focusable.length === 0) {
        event.preventDefault();
        closeButtonRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const frame = requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocusRef.current && document.contains(previousFocusRef.current)) {
        previousFocusRef.current.focus();
      }
      previousFocusRef.current = null;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60]"
      data-context-surface="true"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Fechar painel"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="absolute inset-x-0 bottom-0 max-h-[92dvh] rounded-t-2xl border border-stone-200 bg-white shadow-2xl flex flex-col overflow-hidden sm:inset-y-0 sm:left-auto sm:right-0 sm:w-[min(100%,32rem)] sm:max-h-none sm:rounded-none sm:border-y-0 sm:border-r-0 sm:border-l"
      >
        <header className="flex min-h-16 shrink-0 items-center justify-between gap-4 border-b border-stone-200 px-4 sm:px-5">
          <h2 id={headingId} className="min-w-0 truncate text-base font-semibold text-stone-900">
            {title}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-md text-stone-500 hover:bg-stone-100 hover:text-stone-900 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#00A550]"
            aria-label="Fechar painel"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-5 sm:py-6">
          {children}
        </div>
      </aside>
    </div>
  );
};
