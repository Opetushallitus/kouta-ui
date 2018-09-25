import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {TarjontaMain} from "./views/TarjontaMain";
import { Provider } from "mobx-react";
import './assets/css/styles.css';
import 'oph-virkailija-style-guide/oph-styles.css';
import UrlStore from "./stores/url-store";

ReactDOM.render((
    <Provider urlStore={new UrlStore()}>
        <BrowserRouter basename={'/kouta'}>
            <TarjontaMain/>
        </BrowserRouter>
    </Provider>
), document.getElementById('root'));

