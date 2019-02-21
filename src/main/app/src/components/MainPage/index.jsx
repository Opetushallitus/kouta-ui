import React from 'react';

import { Router, Route, Redirect, Switch } from 'react-router-dom';

import { ReduxToaster } from '../Toaster'; 
import CreateKoulutusPage from '../CreateKoulutusPage';
import CreateToteutusPage from '../CreateToteutusPage';
import CreateHakukohdePage from '../CreateHakukohdePage';
import CreateValintaperusteetPage from '../CreateValintaperusteetPage';
import EditKoulutusPage from '../EditKoulutusPage';
import CreateHakuPage from '../CreateHakuPage';
import EditHakuPage from '../EditHakuPage';

const MainPage = ({ history }) => {
  return (
    <Router history={history}>
      <>
      <ReduxToaster style={{ position: 'fixed', top: '16px', right: '16px', zIndex: '9999' }} />
      <Switch>
        <Route
          path="/organisaatio/:oid/koulutus"
          component={CreateKoulutusPage}
          exact
        />
        <Route
          path="/organisaatio/:organisaatioOid/koulutus/:koulutusOid/toteutus"
          component={CreateToteutusPage}
          exact
        />
        <Route
          path="/organisaatio/:organisaatioOid/haku"
          component={CreateHakuPage}
          exact
        />
        <Route
          path="/organisaatio/:organisaatioOid/toteutus/:toteutusOid/haku/:hakuOid/hakukohde"
          component={CreateHakukohdePage}
          exact
        />
        <Route
          path="/organisaatio/:oid/valintaperusteet"
          component={CreateValintaperusteetPage}
          exact
        />
        <Route
          path="/koulutus/:oid/muokkaus"
          component={EditKoulutusPage}
          exact
        />
        <Route
          path="/haku/:oid/muokkaus"
          component={EditHakuPage}
          exact
        />
        <Redirect to="/" />
      </Switch>
      </>
    </Router>
  );
};

export default MainPage;
