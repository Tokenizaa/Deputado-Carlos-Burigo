import React, { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';

type MobileAccordionProps = {
  title: React.ReactNode;
  summary?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export const MobileAccordion: React.FC<MobileAccordionProps> = ({
  title,
  summary,
  children,
  defaultOpen = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const generatedId = useId();
  const contentId = `mobile-accordion-${generatedId.replace(/:/g, '')}`;

  return (
    <div className="border-t border-stone-200">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((value) => !value)}
        className="md:hidden w-full min-h-[52px] py-4 flex items-center justify-between gap-4 text-left focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#00A550] focus-visible:ring-inset"
      >
        <span className="min-w-0">
          <span className="block font-bold text-stone-900">{title}</span>
          {summary ? <span className="block mt-1 text-xs text-stone-500">{summary}</span> : null}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`w-5 h-5 shrink-0 text-stone-500 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div id={contentId} className={`${open ? 'block' : 'hidden'} md:block`}>
        {children}
      </div>
    </div>
  );
};
