import React from 'react';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import FormPage from '../FormPage';

const MainPage = () => {
  return (
    <Router basename="/kouta">
      <>
        <Switch>
          <Redirect from="/" to="/koulutus" exact />
          <Route
            path={[
              '/koulutus',
              '/toteutus',
              '/haku',
              '/hakukohde',
              '/valintaperusteet',
            ]}
            component={FormPage}
          />
          <Redirect to="/" />
        </Switch>
      </>
    </Router>
  );
};

export default MainPage;
