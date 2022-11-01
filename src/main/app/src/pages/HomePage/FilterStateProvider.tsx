import React from 'react';

import { useInterpret } from '@xstate/react';

import { filterMachine } from '#/src/hooks/useFilter';

export const FilterStateContext = React.createContext({} as any);

const FilterStateProvider = ({ children }) => {
  const filterService = useInterpret(filterMachine);
  return (
    <FilterStateContext.Provider value={{ filterService }}>
      {children}
    </FilterStateContext.Provider>
  );
};

export default FilterStateProvider;
