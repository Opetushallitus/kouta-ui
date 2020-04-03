import { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initialize } from 'redux-form';
import FormNameContext from '#/src/components/FormNameContext';

const useFormName = () => useContext(FormNameContext);

const useInitialValues = initialValues => {
  const dispatch = useDispatch();
  const name = useFormName();
  useEffect(() => {
    dispatch(initialize(name, initialValues));
  }, [dispatch, initialValues, name]);
};

export default useInitialValues;
