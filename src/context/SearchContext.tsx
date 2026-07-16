import React, { createContext, useContext, useState, useCallback } from 'react';
import { seedRecentSearches } from '../data/catalog';

type Ctx = {
  recent: string[];
  addRecent: (q: string) => void;
  clearRecent: () => void;
};

const SearchCtx = createContext<Ctx | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [recent, setRecent] = useState<string[]>(seedRecentSearches);

  const addRecent = useCallback((q: string) => {
    const query = q.trim();
    if (!query) return;
    setRecent((prev) => [query, ...prev.filter((r) => r.toLowerCase() !== query.toLowerCase())].slice(0, 8));
  }, []);

  const clearRecent = useCallback(() => setRecent([]), []);

  return (
    <SearchCtx.Provider value={{ recent, addRecent, clearRecent }}>
      {children}
    </SearchCtx.Provider>
  );
}

export function useSearch(): Ctx {
  const c = useContext(SearchCtx);
  if (!c) throw new Error('useSearch must be used within SearchProvider');
  return c;
}
