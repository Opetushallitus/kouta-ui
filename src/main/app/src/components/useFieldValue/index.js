import { useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import get from 'lodash/get';

import FormNameContext from '../FormNameContext';

const useFieldValue = name => {
  const formName = useContext(FormNameContext);

  const selector = useMemo(
    () => state => {
      return get(state, `form.${formName}.values.${name}`);
    },
    [formName, name],
  );

  return useSelector(selector);
};

export default useFieldValue;
