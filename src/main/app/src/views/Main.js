import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import {Header} from "./layout/Header";
import {Footer} from "./layout/Footer";
import {KoulutusPublicationView} from './koulutus-publication/KoulutusPublicationView';
import {ToteutusView} from './toteutus/ToteutusView';
import {HakuView} from './haku/HakuView';

export class Main extends Component {

    render = () => (
        <React.Fragment>
          <Route path='/' render={() => <Header/>}/>
          <Route exact path='/' render={() => <KoulutusPublicationView/>}/>
          <Route path='/koulutukset' render={() => <KoulutusPublicationView/>}/>
          <Route path='/koulutus' render={() => <KoulutusPublicationView/>}/>
          <Route path='/toteutus' render={() => <ToteutusView/>}/>
          <Route path='/haku' render={() => <HakuView/>}/>
          <Route path='/' render={() => <Footer/>}/>
        </React.Fragment>
    )
}
