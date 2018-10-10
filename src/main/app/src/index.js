import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {Main} from "./views/Main";
import { Provider } from "mobx-react";
import './assets/css/styles.css';
import 'oph-virkailija-style-guide/oph-styles.css';
import  {getUrlStore} from "./stores/UrlStore";
import {getAppStore} from './stores/AppStore';
import {initStores} from './stores/_index';


initStores();

ReactDOM.render((
    <Provider urlStore={getUrlStore()} appStore={getAppStore()} >
        <BrowserRouter basename={'/kouta'}>
            <Main/>
        </BrowserRouter>
    </Provider>
), document.getElementById('root'));

