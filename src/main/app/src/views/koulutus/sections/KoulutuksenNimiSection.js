import {
  APP_EVENT_KOULUTUKSEN_NIMI_TRANSLATION_CLEAR,
  APP_STATE_KOULUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES,
  APP_STATE_KOULUTUKSEN_NIMI_TRANSLATION_MAP,
  //APP_STATE_KOULUTUS_DETAILS
} from '../../../config/states';
import {AbstractNimiSection} from '../../../components/AbstractNimiSection';
import {connectComponent} from '../../../utils/stateUtils';
import {APP_STATE_KOULUTUKSEN_TIEDOT} from "../../../stores/koulutus/KoulutuksenTiedotStore";

export class KoulutuksenNimiSection extends AbstractNimiSection {

  onMount = () => connectComponent(this, {
    [APP_STATE_KOULUTUKSEN_NIMI_TRANSLATION_MAP]: (translationMap) => this.setState({
      ...this.state,
      translationMap
    }),
    [APP_STATE_KOULUTUKSEN_TIEDOT]: (details) => this.setState({
      ...this.state,
      enabled: details.enabled
    })
  });

  getTranslationMapStateName = () => APP_STATE_KOULUTUKSEN_NIMI_TRANSLATION_MAP;

  getSupportedLanguagesStateName = () => APP_STATE_KOULUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES;

  getClearTranslationMapEventName = () => APP_EVENT_KOULUTUKSEN_NIMI_TRANSLATION_CLEAR;

  getClassName = () => 'KoulutuksenNimiSection';

  getHeader = () => 'Koulutuksen nimi';

  getPromptText = () => 'Anna koulutukselle nimi';

  isEnabled = () => this.state.enabled;

  getErrorInstruction = () => 'Valitse ensin koulutus.';

  /*onSubmitButtonClick = () => {
    const state = this.state;
    console.log('KoulutuksenNimiSecion:onSubmitButtonClick:state', state);
    setKoulutuksenNimet(state.translationMap)
  }*/
}

