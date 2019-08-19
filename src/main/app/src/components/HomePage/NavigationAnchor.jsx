import React, { useEffect, useContext } from 'react';

import {
  NavigationDispatchContext,
  REGISTER_ANCHOR,
  UNREGISTER_ANCHOR,
} from './NavigationProvider';

const NavigationAnchor = ({ id }) => {
  const dispatch = useContext(NavigationDispatchContext);

  useEffect(() => {
    dispatch({ type: REGISTER_ANCHOR, payload: { id } });

    return () => {
      dispatch({ type: UNREGISTER_ANCHOR, payload: { id } });
    };
  }, [dispatch, id]);

  return <div id={id} />;
};

export default NavigationAnchor;
