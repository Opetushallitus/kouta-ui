import {getUrlKoutaBackendValintaperusteList} from '../generic/UrlStore';
import {PohjanValintaStore} from '../generic/PohjanValintaStore';
import {SCOPE_VALINTAPERUSTEEN_POHJA} from '../../config/scopes/PohjanValinta';
import {ENTITY_MODIFICATION_MODE} from '../../config/constants';

export const ValintaperusteenPohjaStore = () =>
  PohjanValintaStore(SCOPE_VALINTAPERUSTEEN_POHJA, getUrlKoutaBackendValintaperusteList(), getModeOptions());

const getModeOptions = () => [
  {
    label: 'Luo uusi valintaperuste',
    value: ENTITY_MODIFICATION_MODE.CREATE_ENTITY
  },
  {
    label: 'Kopioi pohjaksi aiemmin luotu valintaperuste',
    value: ENTITY_MODIFICATION_MODE.INHERIT_ENTITY
  },
  {
    label: 'Käytä olemassa olevan valintaperusteen tietoja',
    value: ENTITY_MODIFICATION_MODE.USE_ENTITY
  }
];
