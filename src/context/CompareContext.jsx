import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { storage } from '../utils/storage';

const CompareContext = createContext(null);
export const useCompare = () => useContext(CompareContext);
const MAX = 4;

export function CompareProvider({ children }) {
  const [ids, setIds] = useState(() => storage.get('compare', []));
  useEffect(() => { storage.set('compare', ids); }, [ids]);

  const toggle = useCallback((id) => {
    let result = { added: false, full: false };
    setIds((list) => {
      if (list.includes(id)) { result = { added: false, full: false }; return list.filter((x) => x !== id); }
      if (list.length >= MAX) { result = { added: false, full: true }; return list; }
      result = { added: true, full: false };
      return [...list, id];
    });
    return result;
  }, []);

  const remove = useCallback((id) => setIds((l) => l.filter((x) => x !== id)), []);
  const clear = useCallback(() => setIds([]), []);

  const value = useMemo(
    () => ({ ids, max: MAX, count: ids.length, has: (id) => ids.includes(id), toggle, remove, clear }),
    [ids, toggle, remove, clear]
  );
  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}
