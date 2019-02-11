import { useContext } from 'react';
import { useAsync } from 'react-async';

import HttpContext from '../HttpContext';
import UrlContext from '../UrlContext';

export const useApiAsync = (asyncArgs = {}) => {
  const httpClient = useContext(HttpContext);
  const apiUrls = useContext(UrlContext);

  const props = useAsync({ httpClient, apiUrls, ...asyncArgs });

  return props;
};

export default useApiAsync;
