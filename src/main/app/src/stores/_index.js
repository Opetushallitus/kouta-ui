import {OrganisaatioStore} from './OrganisaatioStore';
import {KoulutusDetailsStore} from './KoulutusDetailsStore';
import {KoulutusListStore} from './KoulutusListStore';
import {SectionStateStore} from './SectionStateStore';
import {KoulutusPersistencyStore} from './KoulutusPersistencyStore';
import {UrlStore} from './UrlStore';
import {WorkflowStore} from './WorkflowStore';

export const initStores = () => {
  UrlStore();
  OrganisaatioStore();
  KoulutusListStore();
  KoulutusDetailsStore();
  SectionStateStore();
  KoulutusPersistencyStore();
  WorkflowStore();
}
