import React from 'react';
import { Router, Route, Redirect, Switch } from 'react-router-dom';

import Toaster from '#/src/components/Toaster';
import RouterScrollToTop from '#/src/components/RouterScrollToTop';

const HomePage = React.lazy(() => import('#/src/pages/HomePage'));
const CreateKoulutusPage = React.lazy(() =>
  import('#/src/pages/koulutus/CreateKoulutusPage')
);
const EditKoulutusPage = React.lazy(() =>
  import('#/src/pages/koulutus/EditKoulutusPage')
);
const RedirectKoulutusPage = React.lazy(() =>
  import('#/src/pages/koulutus/RedirectKoulutusPage')
);
const CreateToteutusPage = React.lazy(() =>
  import('#/src/pages/toteutus/CreateToteutusPage')
);
const EditToteutusPage = React.lazy(() =>
  import('#/src/pages/toteutus/EditToteutusPage')
);
const RedirectToteutusPage = React.lazy(() =>
  import('#/src/pages/toteutus/RedirectToteutusPage')
);
const CreateHakuPage = React.lazy(() =>
  import('#/src/pages/haku/CreateHakuPage')
);
const EditHakuPage = React.lazy(() => import('#/src/pages/haku/EditHakuPage'));

const RedirectHakuPage = React.lazy(() =>
  import('#/src/pages/haku/RedirectHakuPage')
);
const CreateHakukohdePage = React.lazy(() =>
  import('#/src/pages/hakukohde/CreateHakukohdePage')
);
const EditHakukohdePage = React.lazy(() =>
  import('#/src/pages/hakukohde/EditHakukohdePage')
);
const RedirectHakukohdePage = React.lazy(() =>
  import('#/src/pages/hakukohde/RedirectHakukohdePage')
);
const CreateValintaperustePage = React.lazy(() =>
  import('#/src/pages/valintaperuste/CreateValintaperustePage')
);
const EditValintaperustePage = React.lazy(() =>
  import('#/src/pages/valintaperuste/EditValintaperustePage')
);
const RedirectValintaperustePage = React.lazy(() =>
  import('#/src/pages/valintaperuste/RedirectValintaperustePage')
);
const CreateSoraKuvausPage = React.lazy(() =>
  import('#/src/pages/soraKuvaus/CreateSoraKuvausPage')
);
const EditSoraKuvausPage = React.lazy(() =>
  import('#/src/pages/soraKuvaus/EditSoraKuvausPage')
);

const OppilaitosPage = React.lazy(() => import('#/src/pages/OppilaitosPage'));

const OppilaitoksenOsaPage = React.lazy(() =>
  import('#/src/pages/OppilaitoksenOsaPage')
);

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
          <Route path="/koulutus/:oid" component={RedirectKoulutusPage} exact />

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
          <Route path="/toteutus/:oid" component={RedirectToteutusPage} exact />

          <Route
            path="/organisaatio/:organisaatioOid/haku"
            component={CreateHakuPage}
            exact
          />
          <Route
            path="/organisaatio/:organisaatioOid/haku/:oid/muokkaus"
            component={EditHakuPage}
          />
          <Route path="/haku/:oid" component={RedirectHakuPage} />

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
            path="/hakukohde/:oid"
            component={RedirectHakukohdePage}
            exact
          />

          <Route
            path="/organisaatio/:oid/valintaperusteet/kielivalinnat/:kieliValinnat?"
            component={CreateValintaperustePage}
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
