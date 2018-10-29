import {SCOPE_KOULUTUKSEN_KIELIVERSIO} from '../../config/scopes/Kieliversio';
import {getSupportedLanguagesInScope, KieliversioStore} from '../generic/KieliversioStore';

export const KoulutuksenKieliversioStore = () => KieliversioStore(SCOPE_KOULUTUKSEN_KIELIVERSIO);

export const getSupportedLanguages = () => getSupportedLanguagesInScope(SCOPE_KOULUTUKSEN_KIELIVERSIO);
