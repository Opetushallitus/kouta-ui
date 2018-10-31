import {getUrlKoutaBackendToteutusList} from '../generic/UrlStore';
import {PohjanValintaStore} from '../generic/PohjanValintaStore';
import {SCOPE_TOTEUTUKSEN_POHJA} from '../../config/scopes/PohjanValinta';
import {ENTITY_MODIFICATION_MODE} from '../../config/constants';

export const ToteutuksenPohjaStore = () =>
  PohjanValintaStore(SCOPE_TOTEUTUKSEN_POHJA, getUrlKoutaBackendToteutusList(), getModeOptions());

const getModeOptions = () => [
  {
    label: 'Luo uusi toteutus',
    value: ENTITY_MODIFICATION_MODE.CREATE_ENTITY
  },
  {
    label: 'Kopioi pohjaksi aiemmin luotu toteutus',
    value: ENTITY_MODIFICATION_MODE.INHERIT_ENTITY
  },
  {
    label: 'Käytä olemassa olevan toteutuksen tietoja',
    value: ENTITY_MODIFICATION_MODE.USE_ENTITY
  }
];
