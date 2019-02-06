import React from 'react';

import { Router, Route, Redirect, Switch } from 'react-router-dom';

import { ReduxToaster } from '../Toaster'; 
import CreateKoulutusPage from '../CreateKoulutusPage';
import CreateToteutusPage from '../CreateToteutusPage';
import CreateHakukohdePage from '../CreateHakukohdePage';
import CreateHakuPage from '../CreateHakuPage';

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
        <Redirect to="/" />
      </Switch>
      </>
    </Router>
  );
};

export default MainPage;
