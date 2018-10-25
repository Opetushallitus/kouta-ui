import {OrganisaatioStore} from './OrganisaatioStore';
import {KoulutusDetailsStore} from './KoulutusDetailsStore';
import {KoulutuskoodiListStore} from './KoulutuskoodiListStore';
import {SectionStateStore} from './SectionStateStore';
import {KoulutusPersistencyStore} from './KoulutusPersistencyStore';
import {UrlStore} from './UrlStore';
import {WorkflowStore} from './WorkflowStore';
import {KoulutustyyppiCategoryStore} from './KoulutustyyppiCategoryStore';
import {KieliversioStore} from './KieliversioStore';
import {KoulutusNameTranslationStore} from './KoulutusNameTranslationStore';
import {KoulutusListStore} from './KoulutusListStore';
import {KoulutuksenPohjaStore} from './KoulutuksenPohjaStore';

export const initStores = () => {
  UrlStore();
  OrganisaatioStore();
  KoulutustyyppiCategoryStore();
  KoulutuskoodiListStore();
  KoulutusDetailsStore();
  SectionStateStore();
  KoulutusPersistencyStore();
  WorkflowStore();
  KieliversioStore();
  KoulutusNameTranslationStore();
  KoulutusListStore();
  KoulutuksenPohjaStore();
}
