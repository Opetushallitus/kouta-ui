import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Education from './Education';

const Content = () => (
  <Switch>
    <Route path="/koulutus" component={Education} />
    <Route path="/toteutus" component={() => 'Toteutus'} />
    <Route path="/haku" component={() => 'Haku'} />
    <Route path="/hakukohde" component={() => 'Hakukohde'} />
    <Route path="/valintaperusteet" component={() => 'Valintaperusteet'} />
  </Switch>
);

export default Content;
