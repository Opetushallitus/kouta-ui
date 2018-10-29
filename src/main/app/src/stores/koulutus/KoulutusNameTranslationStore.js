import {clearState, connectToOne, getState, setState, updateState} from '../../utils/stateUtils';
import {
  APP_EVENT_KOULUTUS_NAME_EDITED_TRANSLATION_MAP,
  APP_STATE_KOULUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES,
  APP_STATE_KOULUTUS_DETAILS,
  APP_STATE_KOULUTUS_NAME_EDITED_TRANSLATION_MAP,
  APP_STATE_KOULUTUS_NAME_DEFAULT_TRANSLATION_MAP
} from '../../config/states';
import {getSupportedLanguages} from './KoulutuksenKieliversioStore';
import {getNameTranslationMap} from './KoulutusDetailsStore';

export const KoulutusNameTranslationStore = () => {
  configureTranslationInputs();
  connectToOne(APP_STATE_KOULUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES, {}, () => configureTranslationInputs());
  connectToOne(APP_STATE_KOULUTUS_DETAILS, {}, () => {
    clearEditedTranslations();
    configureTranslationInputs();
  })
  connectToOne(APP_EVENT_KOULUTUS_NAME_EDITED_TRANSLATION_MAP, {}, (translations) => setEditedTranslations(translations));
}

const configureTranslationInputs = () => {
  const supportedLanguages = getSupportedLanguages();
  const defaultMap = getNameTranslationMap();
  const editedMap = getEditedTranslationMap();
  const newMap = {};
  supportedLanguages.forEach(languageCode => newMap[languageCode] = getTranslation(editedMap, defaultMap, languageCode));
  setState(APP_STATE_KOULUTUS_NAME_DEFAULT_TRANSLATION_MAP, newMap);
  setState(APP_STATE_KOULUTUS_NAME_EDITED_TRANSLATION_MAP, newMap);
}

const clearEditedTranslations = () => clearState(APP_STATE_KOULUTUS_NAME_EDITED_TRANSLATION_MAP);

const getTranslation = (editedMap, defaultMap, languageCode) => editedMap[languageCode] || defaultMap[languageCode] || '';

export const getEditedTranslationMap = () => getState(APP_STATE_KOULUTUS_NAME_EDITED_TRANSLATION_MAP) || {};

const setEditedTranslations = (translations) => {
  updateState(APP_STATE_KOULUTUS_NAME_EDITED_TRANSLATION_MAP, translations);
}
