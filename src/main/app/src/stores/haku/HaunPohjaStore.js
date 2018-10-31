import {getUrlKoutaBackendHakuList} from '../generic/UrlStore';
import {PohjanValintaStore} from '../generic/PohjanValintaStore';
import {SCOPE_HAUN_POHJA} from '../../config/scopes/PohjanValinta';
import {ENTITY_MODIFICATION_MODE} from '../../config/constants';

export const HaunPohjaStore = () =>
  PohjanValintaStore(SCOPE_HAUN_POHJA, getUrlKoutaBackendHakuList(), getModeOptions());

const getModeOptions = () => [
  {
    label: 'Luo uusi haku',
    value: ENTITY_MODIFICATION_MODE.CREATE_ENTITY
  },
  {
    label: 'Kopioi pohjaksi aiemmin luotu haku',
    value: ENTITY_MODIFICATION_MODE.INHERIT_ENTITY
  },
  {
    label: 'Käytä olemassa olevan haun tietoja',
    value: ENTITY_MODIFICATION_MODE.USE_ENTITY
  }
];
