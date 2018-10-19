import {OrganisaatioStore} from './OrganisaatioStore';
import {KoulutusDetailsStore} from './KoulutusDetailsStore';
import {KoulutusListStore} from './KoulutusListStore';
import {SectionStateStore} from './SectionStateStore';
import {KoulutusPersistencyStore} from './KoulutusPersistencyStore';
import {UrlStore} from './UrlStore';
import {WorkflowStore} from './WorkflowStore';
import {KoulutustyyppiCategoryStore} from './KoulutustyyppiCategoryStore';

export const initStores = () => {
  UrlStore();
  OrganisaatioStore();
  KoulutustyyppiCategoryStore();
  KoulutusListStore();
  KoulutusDetailsStore();
  SectionStateStore();
  KoulutusPersistencyStore();
  WorkflowStore();
}
