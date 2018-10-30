import {
  APP_EVENT_HAUN_NIMI_TRANSLATION_CLEAR,
  APP_STATE_HAUN_KIELIVERSIO_SUPPORTED_LANGUAGES,
  APP_STATE_HAUN_NIMI_TRANSLATION_MAP
} from '../../../config/states';
import {AbstractNimiSection} from '../../../components/AbstractNimiSection';

export class HaunNimiSection extends AbstractNimiSection {

  getTranslationMapStateName = () => APP_STATE_HAUN_NIMI_TRANSLATION_MAP;

  getSupportedLanguagesStateName = () => APP_STATE_HAUN_KIELIVERSIO_SUPPORTED_LANGUAGES;

  getClearTranslationMapEventName = () => APP_EVENT_HAUN_NIMI_TRANSLATION_CLEAR;

  getClassName = () => 'HaunNimiSection';

  getHeader = () => 'Haun nimi';

  getPromptText = () => 'Anna haulle nimi';

}
