import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import TestiLaatikko from "../components/KoulutuksetActionBar";


class TarjontaMain extends Component {
    render() {
        return (
            <Route path='/' render={() => <TestiLaatikko/>}/>
        )
    }
}

export default TarjontaMain;