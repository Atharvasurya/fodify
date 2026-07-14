import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * RouteScrollToTop Component
 * Automatically scrolls the window to the top on every route change.
 * This fixes the issue where React Router retains the previous scroll position
 * when navigating to a new page.
 */
const RouteScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
};

export default RouteScrollToTop;
