import React from 'react';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import HomePage from '../HomePage';
import FormPage from '../FormPage';

const MainPage = () => {
  return (
    <Router basename="/kouta">
      <>
        <Switch>
          <Route path="/" component={HomePage} exact />
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
