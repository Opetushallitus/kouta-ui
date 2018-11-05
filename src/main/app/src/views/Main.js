import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import {Header} from './layout/Header';
import {Footer} from './layout/Footer';
import {KoulutusView} from './koulutus/KoulutusView';
import {ToteutusView} from './toteutus/ToteutusView';
import {HakuView} from './haku/HakuView';
import {HakukohdeView} from './hakukohde/HakukohdeView';
import {ValintaperusteetView} from './valintaperusteet/ValintaperusteetView';

export class Main extends Component {

    render = () => (
        <React.Fragment>
          <Route path='/' render={() => <Header/>}/>
          <Route path='/koulutukset' render={() => <KoulutusView/>}/>
          <Route path='/koulutus' render={() => <KoulutusView/>}/>
          <Route path='/toteutus' render={() => <ToteutusView/>}/>
          <Route path='/haku' render={() => <HakuView/>}/>
          <Route path='/hakukohde' render={() => <HakukohdeView/>}/>
          <Route path='/valintaperusteet' render={() => <ValintaperusteetView/>}/>
          <Route path='/' render={() => <Footer/>}/>
        </React.Fragment>
    )
}
