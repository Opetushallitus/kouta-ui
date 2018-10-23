import {AbstractTranslationEditor} from '../../../../components/AbstractTranslationEditor';
import {APP_EVENT_KOULUTUS_NAME_EDITED_TRANSLATION_MAP, APP_STATE_KOULUTUS_NAME_DEFAULT_TRANSLATION_MAP} from '../../../../config/states';

export class KoulutusNameTranslationEditor extends AbstractTranslationEditor {

  getInputsStateName = () => APP_STATE_KOULUTUS_NAME_DEFAULT_TRANSLATION_MAP;

  getInputChangeEventName = () => APP_EVENT_KOULUTUS_NAME_EDITED_TRANSLATION_MAP;

  getLabel = () => 'Muokkaa koulutuksen nimeä.';

}