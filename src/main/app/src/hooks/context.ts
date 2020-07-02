import { useContext } from 'react';
import UrlContext from '#/src/components/UrlContext';
import HttpClientContext from '#/src/components/HttpContext';

export const useURLs = () => useContext(UrlContext);

export const useHttpClient = () => useContext(HttpClientContext);
