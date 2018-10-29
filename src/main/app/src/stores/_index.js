import {OrganisaatioStore} from './koulutus/OrganisaatioStore';
import {KoulutusDetailsStore} from './koulutus/KoulutusDetailsStore';
import {KoulutuskoodiListStore} from './koulutus/KoulutuskoodiListStore';
import {SectionStateStore} from './generic/SectionStateStore';
import {KoulutusPersistencyStore} from './koulutus/KoulutusPersistencyStore';
import {UrlStore} from './generic/UrlStore';
import {WorkflowStore} from './generic/WorkflowStore';
import {KoulutustyyppiCategoryStore} from './koulutus/KoulutustyyppiCategoryStore';
import {KieliversioStore} from './koulutus/KoulutuksenKieliversioStore';
import {KoulutusNameTranslationStore} from './koulutus/KoulutusNameTranslationStore';
import {KoulutusListStore} from './koulutus/KoulutusListStore';
import {KoulutuksenPohjaStore} from './koulutus/KoulutuksenPohjaStore';
import {ToteutuksenPohjaStore} from './toteutus/ToteutuksenPohjaStore';

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
  KieliversioStore();
  KoulutusNameTranslationStore();
  KoulutusListStore();
  KoulutuksenPohjaStore();
}

const initToteutusStores = () => {
  ToteutuksenPohjaStore();
}

export const initStores = () => {
  initGenericStores();
  initKoulutusStores();
  initToteutusStores();
}
