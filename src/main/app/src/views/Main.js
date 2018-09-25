import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import {Header} from "./layout/Header";
import {Footer} from "./layout/Footer";
import {KoulutusListView} from "./koulutus-list/KoulutusListView";
import {KoulutusPublicationView} from './koulutus-publication/KoulutusPublicationView';

export class Main extends Component {

    render = () => (
        <React.Fragment>
          <Route path='/' render={() => <Header/>}/>
          <Route exact path='/' render={() => <KoulutusListView/>}/>
          <Route path='/koulutukset' render={() => <KoulutusListView/>}/>
          <Route path='/tutkintoon-johtava-koulutus' render={() => <KoulutusPublicationView/>}/>
          <Route path='/' render={() => <Footer/>}/>
        </React.Fragment>
    )
}
