import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import {KoulutuksetActionBar} from "../components/KoulutuksetActionBar";

export class TarjontaMain extends Component {

    render = () => (
        <Route path='/' render={() => <KoulutuksetActionBar/>}/>
    )
}
