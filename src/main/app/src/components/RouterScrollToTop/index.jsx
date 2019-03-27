import { withRouter } from 'react-router-dom';
import { useEffect } from 'react';

const RouterScrollToTop = ({ location, children }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return children;
};

export default withRouter(RouterScrollToTop);
