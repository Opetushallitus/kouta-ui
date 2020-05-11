import React from 'react';

import { Router, Route, Redirect, Switch } from 'react-router-dom';

import { ReduxToaster } from '../Toaster';
import RouterScrollToTop from '../RouterScrollToTop';

const HomePage = React.lazy(() => import('../HomePage'));
const CreateKoulutusPage = React.lazy(() => import('../CreateKoulutusPage'));
const CreateToteutusPage = React.lazy(() => import('../CreateToteutusPage'));
const CreateHakukohdePage = React.lazy(() => import('../CreateHakukohdePage'));

const CreateValintaperustePage = React.lazy(() =>
  import('../CreateValintaperustePage')
);

const CreateHakuPage = React.lazy(() => import('../CreateHakuPage'));

const CreateSoraKuvausPage = React.lazy(() =>
  import('../CreateSoraKuvausPage')
);

const EditKoulutusPage = React.lazy(() => import('../EditKoulutusPage'));
const EditHakuPage = React.lazy(() => import('../EditHakuPage'));
const EditToteutusPage = React.lazy(() => import('../EditToteutusPage'));

const EditValintaperustePage = React.lazy(() =>
  import('../EditValintaperustePage')
);

const EditHakukohdePage = React.lazy(() => import('../EditHakukohdePage'));
const RedirectHakukohdePage = React.lazy(() =>
  import('../EditHakukohdePage/RedirectHakukohdePage')
);
const RedirectToteutusPage = React.lazy(() =>
  import('../EditToteutusPage/RedirectToteutusPage')
);
const RedirectHakuPage = React.lazy(() =>
  import('../EditHakuPage/RedirectHakuPage')
);
const RedirectValintaperustePage = React.lazy(() =>
  import('../EditValintaperustePage/RedirectValintaperustePage')
);
const RedirectKoulutusPage = React.lazy(() =>
  import('../EditKoulutusPage/RedirectKoulutusPage')
);
const EditSoraKuvausPage = React.lazy(() => import('../EditSoraKuvausPage'));
const OppilaitosPage = React.lazy(() => import('../OppilaitosPage'));

const OppilaitoksenOsaPage = React.lazy(() =>
  import('../OppilaitoksenOsaPage')
);

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
            path="/organisaatio/:oid/valintaperusteet/kielivalinnat/:kieliValinnat?"
            component={CreateValintaperustePage}
            exact
          />
          <Route
            path="/organisaatio/:organisaatioOid/sora-kuvaus/kielivalinnat/:kieliValinnat?"
            component={CreateSoraKuvausPage}
            exact
          />
          <Route
            path="/organisaatio/:organisaatioOid/koulutus/:oid/muokkaus"
            component={EditKoulutusPage}
            exact
          />
          <Route path="/koulutus/:oid" component={RedirectKoulutusPage} exact />
          <Route
            path="/organisaatio/:organisaatioOid/haku/:oid/muokkaus"
            component={EditHakuPage}
          />
          <Route path="/haku/:oid" component={RedirectHakuPage} />
          <Route
            path="/organisaatio/:organisaatioOid/toteutus/:oid/muokkaus"
            component={EditToteutusPage}
            exact
          />
          <Route path="/toteutus/:oid" component={RedirectToteutusPage} exact />
          <Route
            path="/organisaatio/:organisaatioOid/hakukohde/:oid/muokkaus"
            component={EditHakukohdePage}
            exact
          />
          <Route
            path="/hakukohde/:oid"
            component={RedirectHakukohdePage}
            exact
          />
          <Route
            path="/organisaatio/:organisaatioOid/valintaperusteet/:id/muokkaus"
            component={EditValintaperustePage}
            exact
          />
          <Route
            path="/valintaperusteet/:oid"
            component={RedirectValintaperustePage}
            exact
          />
          <Route
            path="/organisaatio/:organisaatioOid/sora-kuvaus/:id/muokkaus"
            component={EditSoraKuvausPage}
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

export default MainPage;
