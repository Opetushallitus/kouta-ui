import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {Main} from "./views/Main";
import { Provider } from "mobx-react";
import './assets/css/styles.css';
import 'oph-virkailija-style-guide/oph-styles.css';
import UrlStore from "./stores/url-store";
import AppStore from './stores/app-store';

const urlStore = new UrlStore();
const appStore = new AppStore();

ReactDOM.render((
    <Provider urlStore={urlStore} appStore={appStore}>
        <BrowserRouter basename={'/kouta'}>
            <Main/>
        </BrowserRouter>
    </Provider>
), document.getElementById('root'));

