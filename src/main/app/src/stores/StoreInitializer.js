import {OrganisaatioStore} from './koulutus/OrganisaatioStore';
import {KoulutusDetailsStore} from './koulutus/KoulutusDetailsStore';
import {KoulutuskoodiListStore} from './koulutus/KoulutuskoodiListStore';
import {SectionStateStore} from './generic/SectionStateStore';
import {KoulutusPersistencyStore} from './koulutus/KoulutusPersistencyStore';
import {UrlStore} from './generic/UrlStore';
import {WorkflowStore} from './generic/WorkflowStore';
import {KoulutustyyppiCategoryStore} from './koulutus/KoulutustyyppiCategoryStore';
import {KoulutuksenKieliversioStore} from './koulutus/KoulutuksenKieliversioStore';
import {KoulutusNameTranslationStore} from './koulutus/KoulutusNameTranslationStore';
import {KoulutusListStore} from './koulutus/KoulutusListStore';
import {KoulutuksenPohjaStore} from './koulutus/KoulutuksenPohjaStore';
import {ToteutuksenPohjaStore} from './toteutus/ToteutuksenPohjaStore';
import {ToteutuksenKieliversioStore} from './toteutus/ToteutuksenKieliversioStore';
import {HaunKieliversioStore} from './haku/HaunKieliversioStore';
import {HakukohteenKieliversioStore} from './hakukohde/HakukohteenKieliversioStore';
import {ValintaperusteenKieliversioStore} from './valintaperusteet/ValintaperusteenKieliversioStore';

const initGenericStores = () => {
  UrlStore();
  SectionStateStore();
  WorkflowStore();
};

const initKoulutusStores = () => {
  OrganisaatioStore();
  KoulutustyyppiCategoryStore();
  KoulutuskoodiListStore();
  KoulutusDetailsStore();
  KoulutusPersistencyStore();
  KoulutuksenKieliversioStore();
  KoulutusNameTranslationStore();
  KoulutusListStore();
  KoulutuksenPohjaStore();
}

const initToteutusStores = () => {
  ToteutuksenPohjaStore();
  ToteutuksenKieliversioStore();
}

const initHakuStores = () => {
  HaunKieliversioStore();
}

const initHakukohdeStores = () => {
  HakukohteenKieliversioStore();
}

const initValintaperusteStores = () => {
  ValintaperusteenKieliversioStore();
}

export const initStores = () => {
  initGenericStores();
  initKoulutusStores();
  initToteutusStores();
  initHakuStores();
  initHakukohdeStores();
  initValintaperusteStores();
}
