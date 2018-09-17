import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import TarjontaMain from "./views/TarjontaMain";
import './assets/css/styles.css';
import 'oph-virkailija-style-guide/oph-styles.css';

ReactDOM.render((
    <BrowserRouter basename={'/kouta'}>
        <TarjontaMain/>
    </BrowserRouter>
), document.getElementById('root'));

