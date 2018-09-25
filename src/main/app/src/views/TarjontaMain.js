import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import KoulutuksetActionBar from "../components/KoulutuksetActionBar";


class TarjontaMain extends Component {
    render() {
        return (
            <Route path='/' render={() => <KoulutuksetActionBar/>}/>
        )
    }
}

export default TarjontaMain;