import React, { useReducer } from 'react';

export const NavigationStateContext = React.createContext();

export const NavigationDispatchContext = React.createContext();

export const REGISTER_ANCHOR = 'REGISTER_ANCHOR';

export const UNREGISTER_ANCHOR = 'UNREGISTER_ANCHOR';

const reducer = (state, action) => {
  switch (action.type) {
    case REGISTER_ANCHOR:
      return { ...state, [action.payload.id]: action.payload };
    case UNREGISTER_ANCHOR:
      return { ...state, [action.payload.id]: undefined };
    default:
      return state;
  }
};

const NaviationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {});

  return (
    <NavigationDispatchContext.Provider value={dispatch}>
      <NavigationStateContext.Provider value={state}>
        {children}
      </NavigationStateContext.Provider>
    </NavigationDispatchContext.Provider>
  );
};

export default NaviationProvider;
