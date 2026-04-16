import {createContext, useCallback, useContext, useEffect, useState} from 'react';
import type {ReactNode} from 'react';

/**
 * Quiz drawer context — holds open/close state for the side drawer so any
 * component (Hero CTA, nav link, footer link) can trigger it without prop
 * drilling. Mount the <QuizDrawer /> at app-level (root.tsx).
 */
interface QuizDrawerState {
  open: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

const QuizDrawerContext = createContext<QuizDrawerState | null>(null);

export function QuizDrawerProvider({children}: {children: ReactNode}) {
  const [open, setOpen] = useState(false);

  const openDrawer = useCallback(() => setOpen(true), []);
  const closeDrawer = useCallback(() => setOpen(false), []);
  const toggleDrawer = useCallback(() => setOpen((prev) => !prev), []);

  // Lock body scroll + Escape-to-close while open
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <QuizDrawerContext.Provider value={{open, openDrawer, closeDrawer, toggleDrawer}}>
      {children}
    </QuizDrawerContext.Provider>
  );
}

export function useQuizDrawer(): QuizDrawerState {
  const ctx = useContext(QuizDrawerContext);
  if (!ctx) {
    // Safe SSR fallback — returns no-op functions so useQuizDrawer can be
    // called inside components that may render before the provider.
    return {
      open: false,
      openDrawer: () => {},
      closeDrawer: () => {},
      toggleDrawer: () => {},
    };
  }
  return ctx;
}
