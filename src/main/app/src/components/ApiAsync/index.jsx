import Async from 'react-async';
import { subscribe } from 'react-contextual';

import UrlContext from '../UrlContext';
import HttpContext from '../HttpContext';

export default subscribe([UrlContext, HttpContext], (apiUrls, httpClient) => ({
  httpClient,
  apiUrls,
}))(Async);
