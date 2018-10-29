import {SCOPE_VALINTAPERUSTEEN_KIELIVERSIO} from '../../config/scopes/Kieliversio';
import {getSupportedLanguagesInScope, KieliversioStore} from '../generic/KieliversioStore';

export const ValintaperusteenKieliversioStore = () => KieliversioStore(SCOPE_VALINTAPERUSTEEN_KIELIVERSIO);

export const getSupportedLanguages = () => getSupportedLanguagesInScope(SCOPE_VALINTAPERUSTEEN_KIELIVERSIO);
