import {APP_STATE_HAKUKOHTEEN_KIELIVERSIO_SUPPORTED_LANGUAGES} from '../../../config/states';
import {AbstractNimiSection} from '../../../components/AbstractNimiSection';
import {APP_EVENT_HAKUKOHTEEN_NIMI_TRANSLATION_CLEAR, APP_STATE_HAKUKOHTEEN_NIMI_TRANSLATION_MAP} from '../../../stores/hakukohde/HakukohteenNimiStore';

export class HakukohteenNimiSection extends AbstractNimiSection {

  getTranslationMapStateName = () => APP_STATE_HAKUKOHTEEN_NIMI_TRANSLATION_MAP;

  getSupportedLanguagesStateName = () => APP_STATE_HAKUKOHTEEN_KIELIVERSIO_SUPPORTED_LANGUAGES;

  getClearTranslationMapEventName = () => APP_EVENT_HAKUKOHTEEN_NIMI_TRANSLATION_CLEAR;

  getClassName = () => 'HakukohteenNimiSection';

  getHeader = () => 'Hakukohteen nimi';

  getPromptText = () => 'Anna hakukohteelle nimi';

}
