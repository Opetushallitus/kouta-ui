import {
  APP_EVENT_VALINTAPERUSTEEN_NIMI_TRANSLATION_CLEAR,
  APP_STATE_VALINTAPERUSTEEN_KIELIVERSIO_SUPPORTED_LANGUAGES,
  APP_STATE_VALINTAPERUSTEEN_NIMI_TRANSLATION_MAP
} from '../../../config/states';
import {AbstractNimiSection} from '../../../components/AbstractNimiSection';

export class ValintaperusteenNimiSection extends AbstractNimiSection {

  getStateNameForTranslationMap = () => APP_STATE_VALINTAPERUSTEEN_NIMI_TRANSLATION_MAP;

  getStateNameForSupportedLanguages = () => APP_STATE_VALINTAPERUSTEEN_KIELIVERSIO_SUPPORTED_LANGUAGES;

  getEventNameForClearTranslationMap = () => APP_EVENT_VALINTAPERUSTEEN_NIMI_TRANSLATION_CLEAR;

  getClassName = () => 'ValintaperusteenNimiSection';

  getHeader = () => 'Valintaperusteen nimi';

  getPromptText = () => 'Anna valintaperusteelle nimi';

}
