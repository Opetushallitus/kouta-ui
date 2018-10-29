import {SCOPE_TOTEUTUKSEN_KIELIVERSIO} from '../../config/scopes/Kieliversio';
import {getSupportedLanguagesInScope, KieliversioStore} from '../generic/KieliversioStore';

export const ToteutuksenKieliversioStore = () => KieliversioStore(SCOPE_TOTEUTUKSEN_KIELIVERSIO);

export const getSupportedLanguages = () => getSupportedLanguagesInScope(SCOPE_TOTEUTUKSEN_KIELIVERSIO);
