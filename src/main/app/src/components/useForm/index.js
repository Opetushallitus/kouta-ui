import { useContext } from 'react';
import { useSelector } from 'react-redux';
import get from 'lodash/get';

import FormNameContext from '../FormNameContext';

const useForm = () => {
  const formName = useContext(FormNameContext);

  return useSelector(state => {
    return get(state, `form.${formName}`);
  });
};

export default useForm;
