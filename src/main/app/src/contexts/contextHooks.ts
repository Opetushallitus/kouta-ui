import { useContext } from 'react';
import UrlContext from './UrlContext';
import HttpClientContext from './HttpClientContext';
import AuthorizedUserContext from './AuthorizedUserContext';
import FormNameContext from './FormNameContext';
import KoodistoversiotContext from './KoodistoversiotContext';

export const useAuthorizedUserContext = () => useContext(AuthorizedUserContext);

export const useFormName = () => useContext(FormNameContext);

export const useUrls = () => useContext(UrlContext);

export const useHttpClient = () => useContext(HttpClientContext);

export const useKoodistoVersiot = () => useContext(KoodistoversiotContext);
