import {AbstractNimiSection} from '../../../components/AbstractNimiSection';
import {APP_EVENT_TOTEUTUKSEN_NIMI_TRANSLATION_CLEAR, APP_STATE_TOTEUTUKSEN_NIMI_TRANSLATION_MAP} from '../../../stores/toteutus/ToteutuksenNimiStore';
import {APP_STATE_TOTEUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES} from '../../../stores/toteutus/ToteutuksenKieliversioStore';

export class ToteutuksenNimiSection extends AbstractNimiSection {

  getStateNameForTranslationMap = () => APP_STATE_TOTEUTUKSEN_NIMI_TRANSLATION_MAP;

  getStateNameForSupportedLanguages = () => APP_STATE_TOTEUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES;

  getEventNameForClearTranslationMap = () => APP_EVENT_TOTEUTUKSEN_NIMI_TRANSLATION_CLEAR;

  getClassName = () => 'ToteutuksenNimiSection';

  getHeader = () => 'Toteutuksen nimi';

  getPromptText = () => 'Anna toteutukselle nimi';

}
