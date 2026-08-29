import { useEffect } from 'react';

export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — FitFuel` : 'FitFuel — Fitness Equipment & Supplements';
  }, [title]);
}
