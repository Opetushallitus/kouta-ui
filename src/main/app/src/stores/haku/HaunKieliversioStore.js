import {SCOPE_HAUN_KIELIVERSIO} from '../../config/scopes/Kieliversio';
import {getSupportedLanguagesInScope, KieliversioStore} from '../generic/KieliversioStore';

export const HaunKieliversioStore = () => KieliversioStore(SCOPE_HAUN_KIELIVERSIO);

export const getSupportedLanguages = () => getSupportedLanguagesInScope(SCOPE_HAUN_KIELIVERSIO);
