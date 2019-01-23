import React from 'react';

import { Router, Route, Redirect, Switch } from 'react-router-dom';

import { ReduxToaster } from '../Toaster'; 
import CreateKoulutusPage from '../CreateKoulutusPage';
import CreateToteutusPage from '../CreateToteutusPage';

const CreateHakuPage = () => 'Haku';

const MainPage = ({ history }) => {
  return (
    <Router history={history}>
      <>
      <ReduxToaster style={{ position: 'fixed', top: '16px', right: '16px', zIndex: '999' }} />
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
        <Redirect to="/" />
      </Switch>
      </>
    </Router>
  );
};

export default MainPage;
