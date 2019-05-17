import React from 'react';

import { Router, Route, Redirect, Switch } from 'react-router-dom';

import { ReduxToaster } from '../Toaster';
import CreateKoulutusPage from '../CreateKoulutusPage';
import CreateToteutusPage from '../CreateToteutusPage';
import CreateHakukohdePage from '../CreateHakukohdePage';
import CreateValintaperustePage from '../CreateValintaperustePage';
import EditKoulutusPage from '../EditKoulutusPage';
import CreateHakuPage from '../CreateHakuPage';
import EditHakuPage from '../EditHakuPage';
import HomePage from '../HomePage';
import EditToteutusPage from '../EditToteutusPage';
import EditHakukohdePage from '../EditHakukohdePage';
import EditValintaperustePage from '../EditValintaperustePage';
import RouterScrollToTop from '../RouterScrollToTop';
import CreateSoraKuvausPage from '../CreateSoraKuvausPage';
import EditSoraKuvausPage from '../EditSoraKuvausPage';

const MainPage = ({ history }) => {
  return (
    <Router history={history}>
      <RouterScrollToTop>
        <ReduxToaster
          style={{
            position: 'fixed',
            top: '16px',
            right: '16px',
            zIndex: '9999',
          }}
        />
        <Switch>
          <Route path="/" exact component={HomePage} />
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
            component={CreateValintaperustePage}
            exact
          />
          <Route
            path="/organisaatio/:organisaatioOid/sora-kuvaus"
            component={CreateSoraKuvausPage}
            exact
          />
          <Route
            path="/koulutus/:oid/muokkaus"
            component={EditKoulutusPage}
            exact
          />
          <Route path="/haku/:oid/muokkaus" component={EditHakuPage} />
          <Route
            path="/toteutus/:oid/muokkaus"
            component={EditToteutusPage}
            exact
          />
          <Route
            path="/hakukohde/:oid/muokkaus"
            component={EditHakukohdePage}
            exact
          />
          <Route
            path="/valintaperusteet/:oid/muokkaus"
            component={EditValintaperustePage}
            exact
          />
          <Route
            path="/sora-kuvaus/:id/muokkaus"
            component={EditSoraKuvausPage}
            exact
          />
          <Redirect to="/" />
        </Switch>
      </RouterScrollToTop>
    </Router>
  );
};

export default MainPage;
