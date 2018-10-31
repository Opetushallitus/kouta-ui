import {getUrlKoutaBackendKoulutusList} from '../generic/UrlStore';
import {PohjanValintaStore} from '../generic/PohjanValintaStore';
import {SCOPE_KOULUTUKSEN_POHJA} from '../../config/scopes/PohjanValinta';

export const KoulutuksenPohjaStore = () => PohjanValintaStore(SCOPE_KOULUTUKSEN_POHJA, getUrlKoutaBackendKoulutusList());
