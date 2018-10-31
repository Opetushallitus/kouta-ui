import {getUrlKoutaBackendHakukohdeList} from '../generic/UrlStore';
import {PohjanValintaStore} from '../generic/PohjanValintaStore';
import {SCOPE_HAKUKOHTEEN_POHJA, SCOPE_HAUN_POHJA} from '../../config/scopes/PohjanValinta';
import {ENTITY_MODIFICATION_MODE} from '../../config/constants';

export const HakukohteenPohjaStore = () =>
  PohjanValintaStore(SCOPE_HAKUKOHTEEN_POHJA, getUrlKoutaBackendHakukohdeList(), getModeOptions());

const getModeOptions = () => [
  {
    label: 'Luo uusi hakukohde',
    value: ENTITY_MODIFICATION_MODE.CREATE_ENTITY
  },
  {
    label: 'Kopioi pohjaksi aiemmin luotu hakukohde',
    value: ENTITY_MODIFICATION_MODE.INHERIT_ENTITY
  },
  {
    label: 'Käytä olemassa olevan hakukohteen tietoja',
    value: ENTITY_MODIFICATION_MODE.USE_ENTITY
  }
];
