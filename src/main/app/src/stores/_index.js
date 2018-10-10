import {OrganisaatioStore} from './OrganisaatioStore';
import {KoulutusDetailsStore} from './KoulutusDetailsStore';
import {KoulutusListStore} from './KoulutusListStore';
import {SectionStateStore} from './SectionStateStore';

export const initStores = () => {
  OrganisaatioStore();
  KoulutusListStore();
  KoulutusDetailsStore();
  SectionStateStore();
}
