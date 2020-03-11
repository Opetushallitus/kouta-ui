import { useContext } from 'react';
import UrlContext from '../components/UrlContext';

export const useURLs = () => useContext(UrlContext);
