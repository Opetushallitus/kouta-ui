import React from 'react';
import { Route, Switch } from 'react-router-dom';

import FormHeader from '../FormHeader';
import FormStatus from '../FormStatus';
import FormEditInfo from '../FormEditInfo';

const editInfo = (
  <FormEditInfo
    editor="John Doe"
    date={new Date(1547205166507)}
    historyUrl="https://google.fi"
  />
);

const status = <FormStatus status="saved" />;

const KoulutusHeader = () => (
  <FormHeader status={status} editInfo={editInfo}>
    Tutkintoon johtava koulutus
  </FormHeader>
);

const ToteutusHeader = () => (
  <FormHeader status={status} editInfo={editInfo}>
    Koulutuksen toteutus
  </FormHeader>
);

const HakuHeader = () => (
  <FormHeader status={status} editInfo={editInfo}>
    Hakutiedot
  </FormHeader>
);

const HakuKohdeHeader = () => (
  <FormHeader status={status} editInfo={editInfo}>
    Hakukohde
  </FormHeader>
);

const ValintaperusteetHeader = () => (
  <FormHeader status={status} editInfo={editInfo}>
    Valintaperustekuvaukset
  </FormHeader>
);

const HeaderRoutes = () => (
  <Switch>
    <Route path="/koulutus" component={KoulutusHeader} />
    <Route path="/toteutus" component={ToteutusHeader} />
    <Route path="/haku" component={HakuHeader} />
    <Route path="/hakukohde" component={HakuKohdeHeader} />
    <Route path="/valintaperusteet" component={ValintaperusteetHeader} />
  </Switch>
);

export default HeaderRoutes;
