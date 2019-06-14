import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import {
  openToast as openToasterToast,
  closeToast as closeToasterToast,
} from '../../state/toaster';

const useToaster = () => {
  const dispatch = useDispatch();

  const openToast = useCallback(
    options => {
      dispatch(openToasterToast(options));
    },
    [dispatch],
  );

  const closeToast = useCallback(
    key => {
      dispatch(closeToasterToast(key));
    },
    [dispatch],
  );

  return {
    openToast,
    closeToast,
  };
};

export default useToaster;
