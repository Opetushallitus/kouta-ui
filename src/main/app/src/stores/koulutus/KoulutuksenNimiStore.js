import {NimiStore} from '../generic/NimiStore';
import {SCOPE_KOULUTUKSEN_NIMI} from '../../config/scopes/Nimi';
import {APP_STATE_KOULUTUKSEN_NIMI_TRANSLATION_MAP, APP_STATE_KOULUTUS_DETAILS} from '../../config/states';
import {getState, handleEvent, updateState} from '../../utils/stateUtils';
import {filterByKeys} from '../../utils/objectUtils';

export const KoulutuksenNimiStore = () => {
  NimiStore(SCOPE_KOULUTUKSEN_NIMI);
  handleEvent(APP_STATE_KOULUTUS_DETAILS, (details) => configureTranslationMap(details.nameTranslationMap));
};

export const getEditedTranslationMap = () => getState(APP_STATE_KOULUTUKSEN_NIMI_TRANSLATION_MAP);

export const getTranslationMapByLanguages = (languages) => filterByKeys(getEditedTranslationMap(), languages);

const configureTranslationMap = (translationMap) =>
  updateState(APP_STATE_KOULUTUKSEN_NIMI_TRANSLATION_MAP, translationMap);