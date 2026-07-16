import React, { createContext, useContext, useState, useCallback } from 'react';
import { seedRecentSearches } from '../data/catalog';
import { Persona } from '../search/personalize';

type Ctx = {
  recent: string[];
  addRecent: (q: string) => void;
  clearRecent: () => void;
  persona: Persona;
  setPersona: (p: Persona) => void;
};

const SearchCtx = createContext<Ctx | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [recent, setRecent] = useState<string[]>(seedRecentSearches);
  const [persona, setPersona] = useState<Persona>('existing');

  const addRecent = useCallback((q: string) => {
    const query = q.trim();
    if (!query) return;
    setRecent((prev) => [query, ...prev.filter((r) => r.toLowerCase() !== query.toLowerCase())].slice(0, 8));
  }, []);

  const clearRecent = useCallback(() => setRecent([]), []);

  return (
    <SearchCtx.Provider value={{ recent, addRecent, clearRecent, persona, setPersona }}>
      {children}
    </SearchCtx.Provider>
  );
}

export function useSearch(): Ctx {
  const c = useContext(SearchCtx);
  if (!c) throw new Error('useSearch must be used within SearchProvider');
  return c;
}
