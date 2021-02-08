import { useEffect } from 'react';

import { useLocation } from 'react-router-dom';

const RouterScrollToTop = ({ children }) => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return children;
};

export default RouterScrollToTop;
