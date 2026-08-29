import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { storage } from '../utils/storage';

const WishlistContext = createContext(null);
export const useWishlist = () => useContext(WishlistContext);

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(() => storage.get('wishlist', []));
  useEffect(() => { storage.set('wishlist', ids); }, [ids]);

  const toggle = useCallback((id) => {
    let added = false;
    setIds((list) => {
      added = !list.includes(id);
      return added ? [...list, id] : list.filter((x) => x !== id);
    });
    return added;
  }, []);

  const remove = useCallback((id) => setIds((l) => l.filter((x) => x !== id)), []);
  const clear = useCallback(() => setIds([]), []);

  const value = useMemo(
    () => ({ ids, count: ids.length, has: (id) => ids.includes(id), toggle, remove, clear }),
    [ids, toggle, remove, clear]
  );
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
