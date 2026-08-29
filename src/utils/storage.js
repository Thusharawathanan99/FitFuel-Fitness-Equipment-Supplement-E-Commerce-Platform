/** localStorage with a namespace and safe failure — private windows and quota errors must not crash a page. */
const NS = 'fitfuel:';

export const storage = {
  get(key, fallback) {
    try {
      const raw = window.localStorage.getItem(NS + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(NS + key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  remove(key) {
    try {
      window.localStorage.removeItem(NS + key);
    } catch {
      /* ignore */
    }
  }
};
