import { useContext } from 'react';
import { useSelector } from 'react-redux';

import FormNameContext from '../FormNameContext';
import { isDirty } from 'redux-form';

const useFieldValue = () => {
  const formName = useContext(FormNameContext);

  return useSelector(isDirty(formName));
};

export default useFieldValue;
