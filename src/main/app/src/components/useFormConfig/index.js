import { useContext, useMemo } from 'react';

import FormConfigContext from '../FormConfigContext';

const useFormConfig = () => {
  const contextConfig = useContext(FormConfigContext);

  return useMemo(() => {
    return {
      fields: {},
      sections: {},
      ...(contextConfig || {}),
    };
  }, [contextConfig]);
};

export default useFormConfig;
