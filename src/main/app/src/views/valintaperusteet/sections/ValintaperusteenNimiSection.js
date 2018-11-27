import {APP_STATE_VALINTAPERUSTEEN_KIELIVERSIO_SUPPORTED_LANGUAGES} from '../../../config/states';
import {AbstractNimiSection} from '../../../components/AbstractNimiSection';
import {
  APP_EVENT_VALINTAPERUSTEEN_NIMI_TRANSLATION_CLEAR,
  APP_STATE_VALINTAPERUSTEEN_NIMI_TRANSLATION_MAP
} from '../../../stores/valintaperusteet/ValintaperusteenNimiStore';

export class ValintaperusteenNimiSection extends AbstractNimiSection {

  getTranslationMapStateName = () => APP_STATE_VALINTAPERUSTEEN_NIMI_TRANSLATION_MAP;

  getSupportedLanguagesStateName = () => APP_STATE_VALINTAPERUSTEEN_KIELIVERSIO_SUPPORTED_LANGUAGES;

  getClearTranslationMapEventName = () => APP_EVENT_VALINTAPERUSTEEN_NIMI_TRANSLATION_CLEAR;

  getClassName = () => 'ValintaperusteenNimiSection';

  getHeader = () => 'Valintaperusteen nimi';

  getPromptText = () => 'Anna valintaperusteelle nimi';

}
