"use client";
import { createContext, useContext, useState, ReactNode } from 'react';

interface LayoutContextType {
  setGradient: (gradient: string) => void;
  gradient: string;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [gradient, setGradient] = useState('#164e63');

  return (
    <LayoutContext.Provider value={{ gradient, setGradient }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
} 