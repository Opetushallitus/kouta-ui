import {APP_STATE_HAUN_YHTEYSTIEDOT, clearValues, storeValues} from '../../../stores/haku/HaunYhteystiedotStore';
import {APP_STATE_HAUN_KIELIVERSIO_SUPPORTED_LANGUAGES} from "../../../stores/haku/HaunKieliversioStore";
import {AbstractYhteystiedotSection} from '../../../components/AbstractYhteystiedotSection';

export class HaunYhteystiedotSection extends AbstractYhteystiedotSection {

  getStateNameForYhteystiedot = () => APP_STATE_HAUN_YHTEYSTIEDOT;

  getStateNameForSupportedLanguages = () => APP_STATE_HAUN_KIELIVERSIO_SUPPORTED_LANGUAGES;

  getClassName = () => 'HaunYhteystiedotSection';

  getHeader = () => 'Haun yhteystiedot';

  onClearButtonClick = () => clearValues();

  notifyValuesUpdated = () => storeValues(this.state.valueMap);

  onSubmitButtonClick = () => {
    this.setSectionDone();
  };

}
