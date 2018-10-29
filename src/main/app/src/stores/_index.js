import {OrganisaatioStore} from './OrganisaatioStore';
import {KoulutusDetailsStore} from './KoulutusDetailsStore';
import {KoulutuskoodiListStore} from './KoulutuskoodiListStore';
import {SectionStateStore} from './SectionStateStore';
import {KoulutusPersistencyStore} from './KoulutusPersistencyStore';
import {UrlStore} from './UrlStore';
import {WorkflowStore} from './WorkflowStore';
import {KoulutustyyppiCategoryStore} from './KoulutustyyppiCategoryStore';
import {KieliversioStore} from './KoulutuksenKieliversioStore';
import {KoulutusNameTranslationStore} from './KoulutusNameTranslationStore';
import {KoulutusListStore} from './KoulutusListStore';
import {KoulutuksenPohjaStore} from './KoulutuksenPohjaStore';
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
