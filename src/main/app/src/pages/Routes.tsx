import React from 'react';

import { Router, Route, Redirect, Switch } from 'react-router-dom';

import RouterScrollToTop from '#/src/components/RouterScrollToTop';
import { Toaster } from '#/src/components/Toaster';
import { ENTITY } from '#/src/constants';

import { CreateHakuPage } from './haku/CreateHakuPage';
import { EditHakuPage } from './haku/EditHakuPage';
import { CreateHakukohdePage } from './hakukohde/CreateHakukohdePage';
import { EditHakukohdePage } from './hakukohde/EditHakukohdePage';
import HomePage from './HomePage';
import { CreateKoulutusPage } from './koulutus/CreateKoulutusPage';
import { EditKoulutusPage } from './koulutus/EditKoulutusPage';
import { OppilaitoksenOsaPage } from './OppilaitoksenOsaPage/OppilaitoksenOsaPage';
import { OppilaitosPage } from './OppilaitosPage/OppilaitosPage';
import { createRedirectEntityPage } from './RedirectEntityPage';
import { CreateSoraKuvausPage } from './soraKuvaus/CreateSoraKuvausPage';
import { EditSoraKuvausPage } from './soraKuvaus/EditSoraKuvausPage';
import { CreateToteutusPage } from './toteutus/CreateToteutusPage';
import { EditToteutusPage } from './toteutus/EditToteutusPage';
import { CreateValintaperustePage } from './valintaperuste/CreateValintaperustePage';
import { EditValintaperustePage } from './valintaperuste/EditValintaperustePage';

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
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route exact path="/organisaatio/:organisaatioOid/koulutus">
            <CreateKoulutusPage />
          </Route>
          <Route
            path="/organisaatio/:organisaatioOid/koulutus/:oid/muokkaus"
            exact
          >
            <EditKoulutusPage />
          </Route>
          <Route exact path={['/koulutus/:oid', '/koulutus/:oid/muokkaus']}>
            <RedirectKoulutusPage />
          </Route>

          <Route
            path="/organisaatio/:organisaatioOid/koulutus/:koulutusOid/toteutus"
            exact
          >
            <CreateToteutusPage />
          </Route>
          <Route
            path="/organisaatio/:organisaatioOid/toteutus/:oid/muokkaus"
            exact
          >
            <EditToteutusPage />
          </Route>
          <Route exact path={['/toteutus/:oid', '/toteutus/:oid/muokkaus']}>
            <RedirectToteutusPage />
          </Route>

          <Route exact path="/organisaatio/:organisaatioOid/haku">
            <CreateHakuPage />
          </Route>
          <Route exact path="/organisaatio/:organisaatioOid/haku/:oid/muokkaus">
            <EditHakuPage />
          </Route>
          <Route exact path={['/haku/:oid', '/haku/:oid/muokkaus']}>
            <RedirectHakuPage />
          </Route>

          <Route
            path="/organisaatio/:organisaatioOid/toteutus/:toteutusOid/haku/:hakuOid/hakukohde"
            exact
          >
            <CreateHakukohdePage />
          </Route>
          <Route
            path="/organisaatio/:organisaatioOid/hakukohde/:oid/muokkaus"
            exact
          >
            <EditHakukohdePage />
          </Route>
          <Route exact path={['/hakukohde/:oid', '/hakukohde/:oid/muokkaus']}>
            <RedirectHakukohdePage />
          </Route>

          <Route
            path="/organisaatio/:organisaatioOid/valintaperusteet/kielivalinnat/:kieliValinnat?"
            exact
          >
            <CreateValintaperustePage />
          </Route>
          <Route
            path="/organisaatio/:organisaatioOid/valintaperusteet/kielivalinnat/:kieliValinnat/koulutustyyppi/:koulutustyyppi"
            exact
          >
            <CreateValintaperustePage />
          </Route>
          <Route
            path="/organisaatio/:organisaatioOid/valintaperusteet/:id/muokkaus"
            exact
          >
            <EditValintaperustePage />
          </Route>
          <Route
            path={['/valintaperusteet/:oid', '/valintaperusteet/:oid/muokkaus']}
            exact
          >
            <RedirectValintaperustePage />
          </Route>

          <Route
            path="/organisaatio/:organisaatioOid/sora-kuvaus/kielivalinnat/:kieliValinnat?"
            exact
          >
            <CreateSoraKuvausPage />
          </Route>
          <Route
            path="/organisaatio/:organisaatioOid/sora-kuvaus/:id/muokkaus"
            exact
          >
            <EditSoraKuvausPage />
          </Route>

          <Route path={['/sora-kuvaus/:oid', '/sora-kuvaus/:oid/muokkaus']}>
            <RedirectSoraKuvausPage />
          </Route>

          <Route exact path="/organisaatio/:organisaatioOid/oppilaitos">
            <OppilaitosPage />
          </Route>

          <Route exact path="/organisaatio/:organisaatioOid/oppilaitoksen-osa">
            <OppilaitoksenOsaPage />
          </Route>

          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </RouterScrollToTop>
    </Router>
  );
};

export default Routes;
