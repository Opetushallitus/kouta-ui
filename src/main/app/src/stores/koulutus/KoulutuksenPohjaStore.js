import {getUrlKoutaBackendKoulutusList} from '../generic/UrlStore';
import {PohjanValintaStore} from '../generic/PohjanValintaStore';
import {SCOPE_KOULUTUKSEN_POHJA} from '../../config/scopes/PohjanValinta';
import {ENTITY_MODIFICATION_MODE} from '../../config/constants';

export const KoulutuksenPohjaStore = () =>
  PohjanValintaStore(SCOPE_KOULUTUKSEN_POHJA, getUrlKoutaBackendKoulutusList(), getModeOptions());

const getModeOptions = () => [
  {
    label: 'Luo uusi koulutus',
    value: ENTITY_MODIFICATION_MODE.CREATE_ENTITY
  },
  {
    label: 'Kopioi pohjaksi aiemmin luotu koulutus',
    value: ENTITY_MODIFICATION_MODE.INHERIT_ENTITY
  },
  {
    label: 'Käytä olemassa olevan toteutuksen tietoja',
    value: ENTITY_MODIFICATION_MODE.USE_ENTITY
  }
];
