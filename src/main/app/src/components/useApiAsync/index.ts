import { useContext } from 'react';
import { useAsync } from 'react-async';

import HttpContext from '../HttpContext';
import UrlContext from '../UrlContext';

import { isDev } from '#/src/utils';

export const useApiAsync = (asyncArgs = {}) => {
  const httpClient = useContext(HttpContext);
  const apiUrls = useContext(UrlContext);

  const result = useAsync({ httpClient, apiUrls, ...asyncArgs });
  isDev && result.error && console.error(result.error);
  return result;
};

export default useApiAsync;
