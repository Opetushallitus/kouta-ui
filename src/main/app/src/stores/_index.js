import {OrganisaatioStore} from './OrganisaatioStore';
import {KoulutusDetailsStore} from './KoulutusDetailsStore';
import {KoulutusListStore} from './KoulutusListStore';
import {SectionStateStore} from './SectionStateStore';
import {KoulutusPersistencyStore} from './KoulutusPersistencyStore';
import {clearEventLog} from '../utils/logging';

export const initStores = () => {
  clearEventLog();
  OrganisaatioStore();
  KoulutusListStore();
  KoulutusDetailsStore();
  SectionStateStore();
  KoulutusPersistencyStore();
}
