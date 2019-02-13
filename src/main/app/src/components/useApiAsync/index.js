import { useContext } from 'react';
import { useAsync } from 'react-async';

import HttpContext from '../HttpContext';
import UrlContext from '../UrlContext';

export const useApiAsync = (asyncArgs = {}) => {
  const httpClient = useContext(HttpContext);
  const apiUrls = useContext(UrlContext);

  return useAsync({ httpClient, apiUrls, ...asyncArgs });
};

export default useApiAsync;
