import {NimiStore} from '../generic/NimiStore';
import {SCOPE_KOULUTUKSEN_NIMI} from '../../config/scopes/Nimi';
import {APP_STATE_KOULUTUKSEN_NIMI_TRANSLATION_MAP} from '../../config/states';
import {handleEvent, updateState} from '../../utils/stateUtils';
import {APP_STATE_KOULUTUKSEN_TIEDOT} from './KoulutuksenTiedotStore';

export const KoulutuksenNimiStore = () => {
  NimiStore(SCOPE_KOULUTUKSEN_NIMI);
  handleEvent(APP_STATE_KOULUTUKSEN_TIEDOT, (details) => configureTranslationMap(details.nameTranslationMap));
};

const configureTranslationMap = (translationMap) =>
  updateState(APP_STATE_KOULUTUKSEN_NIMI_TRANSLATION_MAP, translationMap);
