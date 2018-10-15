import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {Main} from "./views/Main";
import './assets/css/styles.css';
import 'oph-virkailija-style-guide/oph-styles.css';
import {initStores} from './stores/_index';

initStores();

ReactDOM.render((
  <BrowserRouter basename={'/kouta'}>
      <Main/>
  </BrowserRouter>
), document.getElementById('root'));

