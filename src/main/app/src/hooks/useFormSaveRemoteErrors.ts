import { createGlobalState } from 'react-use';

type RemoteError = {
  errorType: string;
  meta: {
    toteutukset: Array<string>;
  };
};

const useFormRemoteErrorsState = createGlobalState<Array<RemoteError> | null>(
  null
);

export const useFormSaveRemoteErrors = () => {
  const [remoteErrors, setRemoteErrors] = useFormRemoteErrorsState();

  return {
    remoteErrors,
    setRemoteErrors: (errors: Array<RemoteError> | null) =>
      setRemoteErrors(errors),
  };
};
