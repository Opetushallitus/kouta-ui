import React from 'react';

import { Router, Route, Redirect, Switch } from 'react-router-dom';

import RouterScrollToTop from '#/src/components/RouterScrollToTop';
import Toaster from '#/src/components/Toaster';
import { ENTITY } from '#/src/constants';

import CreateHakuPage from './haku/CreateHakuPage';
import EditHakuPage from './haku/EditHakuPage';
import CreateHakukohdePage from './hakukohde/CreateHakukohdePage';
import EditHakukohdePage from './hakukohde/EditHakukohdePage';
import HomePage from './HomePage';
import CreateKoulutusPage from './koulutus/CreateKoulutusPage';
import EditKoulutusPage from './koulutus/EditKoulutusPage';
import OppilaitoksenOsaPage from './OppilaitoksenOsaPage/OppilaitoksenOsaPage';
import OppilaitosPage from './OppilaitosPage/OppilaitosPage';
import { createRedirectEntityPage } from './RedirectEntityPage';
import CreateSoraKuvausPage from './soraKuvaus/CreateSoraKuvausPage';
import EditSoraKuvausPage from './soraKuvaus/EditSoraKuvausPage';
import CreateToteutusPage from './toteutus/CreateToteutusPage';
import EditToteutusPage from './toteutus/EditToteutusPage';
import CreateValintaperustePage from './valintaperuste/CreateValintaperustePage';
import EditValintaperustePage from './valintaperuste/EditValintaperustePage';

const RedirectKoulutusPage = createRedirectEntityPage({
  entityType: ENTITY.KOULUTUS,
  getRedirectUrl: ({ organisaatioOid, oid }) =>
    `/organisaatio/${organisaatioOid}/koulutus/${oid}/muokkaus`,
});

const RedirectToteutusPage = createRedirectEntityPage({
  entityType: ENTITY.TOTEUTUS,
  getRedirectUrl: ({ organisaatioOid, oid }) =>
    `/organisaatio/${organisaatioOid}/toteutus/${oid}/muokkaus`,
});

const RedirectHakuPage = createRedirectEntityPage({
  entityType: ENTITY.HAKU,
  getRedirectUrl: ({ organisaatioOid, oid }) =>
    `/organisaatio/${organisaatioOid}/haku/${oid}/muokkaus`,
});

const RedirectHakukohdePage = createRedirectEntityPage({
  entityType: ENTITY.HAKUKOHDE,
  getRedirectUrl: ({ organisaatioOid, oid }) =>
    `/organisaatio/${organisaatioOid}/hakukohde/${oid}/muokkaus`,
});

const RedirectValintaperustePage = createRedirectEntityPage({
  entityType: ENTITY.VALINTAPERUSTE,
  getRedirectUrl: ({ organisaatioOid, oid }) =>
    `/organisaatio/${organisaatioOid}/valintaperusteet/${oid}/muokkaus`,
});

const RedirectSoraKuvausPage = createRedirectEntityPage({
  entityType: ENTITY.SORA_KUVAUS,
  getRedirectUrl: ({ organisaatioOid, oid }) =>
    `/organisaatio/${organisaatioOid}/sora-kuvaus/${oid}/muokkaus`,
});

const Routes = ({ history }) => {
  return (
    <Router history={history}>
      <RouterScrollToTop>
        <Toaster
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
            path="/organisaatio/:organisaatioOid/koulutus/:oid/muokkaus"
            component={EditKoulutusPage}
            exact
          />
          <Route
            path={['/koulutus/:oid', '/koulutus/:oid/muokkaus']}
            component={RedirectKoulutusPage}
            exact
          />

          <Route
            path="/organisaatio/:organisaatioOid/koulutus/:koulutusOid/toteutus"
            component={CreateToteutusPage}
            exact
          />
          <Route
            path="/organisaatio/:organisaatioOid/toteutus/:oid/muokkaus"
            component={EditToteutusPage}
            exact
          />
          <Route
            path={['/toteutus/:oid', '/toteutus/:oid/muokkaus']}
            component={RedirectToteutusPage}
            exact
          />

          <Route
            path="/organisaatio/:organisaatioOid/haku"
            component={CreateHakuPage}
            exact
          />
          <Route
            path="/organisaatio/:organisaatioOid/haku/:oid/muokkaus"
            component={EditHakuPage}
            exact
          />
          <Route
            path={['/haku/:oid', '/haku/:oid/muokkaus']}
            component={RedirectHakuPage}
            exact
          />

          <Route
            path="/organisaatio/:organisaatioOid/toteutus/:toteutusOid/haku/:hakuOid/hakukohde"
            component={CreateHakukohdePage}
            exact
          />
          <Route
            path="/organisaatio/:organisaatioOid/hakukohde/:oid/muokkaus"
            component={EditHakukohdePage}
            exact
          />
          <Route
            path={['/hakukohde/:oid', '/hakukohde/:oid/muokkaus']}
            component={RedirectHakukohdePage}
            exact
          />

          <Route
            path="/organisaatio/:organisaatioOid/valintaperusteet/kielivalinnat/:kieliValinnat?"
            component={CreateValintaperustePage}
            exact
          />
          <Route
            path="/organisaatio/:organisaatioOid/valintaperusteet/:id/muokkaus"
            component={EditValintaperustePage}
            exact
          />
          <Route
            path={['/valintaperusteet/:oid', '/valintaperusteet/:oid/muokkaus']}
            component={RedirectValintaperustePage}
            exact
          />

          <Route
            path="/organisaatio/:organisaatioOid/sora-kuvaus/kielivalinnat/:kieliValinnat?"
            component={CreateSoraKuvausPage}
            exact
          />
          <Route
            path="/organisaatio/:organisaatioOid/sora-kuvaus/:id/muokkaus"
            component={EditSoraKuvausPage}
            exact
          />

          <Route
            path={['/sora-kuvaus/:oid', '/sora-kuvaus/:oid/muokkaus']}
            component={RedirectSoraKuvausPage}
            exact
          />

          <Route
            path="/organisaatio/:organisaatioOid/oppilaitos"
            component={OppilaitosPage}
            exact
          />

          <Route
            path="/organisaatio/:organisaatioOid/oppilaitoksen-osa"
            component={OppilaitoksenOsaPage}
            exact
          />
          <Redirect to="/" />
        </Switch>
      </RouterScrollToTop>
    </Router>
  );
};

export default Routes;
