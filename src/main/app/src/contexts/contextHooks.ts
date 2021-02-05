import { useContext } from 'react';

import AuthorizedUserContext from './AuthorizedUserContext';
import FormNameContext from './FormNameContext';
import HttpClientContext from './HttpClientContext';
import KoodistoversiotContext from './KoodistoversiotContext';
import UrlContext from './UrlContext';

export const useAuthorizedUserContext = () => useContext(AuthorizedUserContext);

export const useFormName = () => useContext(FormNameContext);

export const useUrls = () => useContext(UrlContext);

export const useHttpClient = () => useContext(HttpClientContext);

export const useKoodistoVersiot = () => useContext(KoodistoversiotContext);
