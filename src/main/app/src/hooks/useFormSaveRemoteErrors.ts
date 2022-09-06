import { createGlobalState } from 'react-use';

const useFormRemoteErrorsState = createGlobalState(null);

export const useFormSaveRemoteErrors = () => {
  const [remoteErrors, setRemoteErrors] = useFormRemoteErrorsState();

  return {
    remoteErrors,
    setRemoteErrors: errors => setRemoteErrors(errors),
  };
};
