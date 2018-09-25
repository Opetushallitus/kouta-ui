import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import {Header} from "../components/Header";
import {Footer} from "../components/Footer";
import {KoulutuksetPage} from "../components/KoulutuksetPage";
import {KoulutusPublicationPage} from '../components/KoulutusPublicationPage';

export class Main extends Component {

    render = () => (
        <React.Fragment>
          <Route path='/' render={() => <Header/>}/>
          <Route exact path='/' render={() => <KoulutuksetPage/>}/>
          <Route path='/koulutukset' render={() => <KoulutuksetPage/>}/>
          <Route path='/tutkintoon-johtava-koulutus' render={() => <KoulutusPublicationPage/>}/>
          <Route path='/' render={() => <Footer/>}/>
        </React.Fragment>

    )
}
