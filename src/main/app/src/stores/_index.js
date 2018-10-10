import {OrganisaatioStore} from './OrganisaatioStore';
import {KoulutusDetailsStore} from './KoulutusDetailsStore';
import {KoulutusListStore} from './KoulutusListStore';

export const initStores = () => {
  OrganisaatioStore();
  KoulutusListStore();
  KoulutusDetailsStore();
}