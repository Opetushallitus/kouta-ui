import React from 'react';

import { Router, Route, Redirect, Switch } from 'react-router-dom';

import CreateKoulutusPage from '../CreateKoulutusPage';
import CreateToteutusPage from '../CreateToteutusPage';

const MainPage = ({ history }) => {
  return (
    <Router history={history}>
      <Switch>
        <Redirect from="/" to="/koulutus" exact />
        <Route path="/koulutus" component={CreateKoulutusPage} exact />
        <Route
          path="/koulutus/:oid/toteutus"
          component={CreateToteutusPage}
          exact
        />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};

export default MainPage;
