import {connectToOne, setState, updateState} from '../../utils/stateUtils';
import {EVENT_TRANSLATION_CHANGE, EVENT_TRANSLATION_CLEAR, STATE_TRANSLATION_MAP} from '../../config/scopes/Nimi';

export const NimiStore = (scope) => {
  connectToOne(scope[EVENT_TRANSLATION_CHANGE], {}, (change) =>
    updateTranslation(scope, change.key, change.value));
  connectToOne(scope[EVENT_TRANSLATION_CLEAR], {}, () => clearTranslations(scope));
  clearTranslations(scope);
};

const clearTranslations = (scope) => setState(scope[STATE_TRANSLATION_MAP], {fi: '', sv: '', en: ''});

const updateTranslation = (scope, language, translation) => updateState(scope[STATE_TRANSLATION_MAP], {
  [language]: translation
});
