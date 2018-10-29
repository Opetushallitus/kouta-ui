import {SCOPE_HAKUKOHTEEN_KIELIVERSIO} from '../../config/scopes/Kieliversio';
import {getSupportedLanguagesInScope, KieliversioStore} from '../generic/KieliversioStore';

export const HakukohteenKieliversioStore = () => KieliversioStore(SCOPE_HAKUKOHTEEN_KIELIVERSIO);

export const getSupportedLanguages = () => getSupportedLanguagesInScope(SCOPE_HAKUKOHTEEN_KIELIVERSIO);
