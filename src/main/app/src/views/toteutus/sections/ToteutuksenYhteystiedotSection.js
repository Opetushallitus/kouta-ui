import {
  APP_STATE_TOTEUTUKSEN_YHTEYSTIEDOT,
  clearValues,
  storeValues
} from '../../../stores/toteutus/ToteutuksenYhteystiedotStore';
import {APP_STATE_TOTEUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES} from "../../../stores/toteutus/ToteutuksenKieliversioStore";
import {AbstractYhteystiedotSection} from '../../../components/AbstractYhteystiedotSection';

export class ToteutuksenYhteystiedotSection extends AbstractYhteystiedotSection {

  getStateNameForYhteystiedot = () => APP_STATE_TOTEUTUKSEN_YHTEYSTIEDOT;

  getStateNameForSupportedLanguages = () => APP_STATE_TOTEUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES;

  getClassName = () => 'ToteutuksenYhteystiedotSection';

  getHeader = () => 'Koulutuksen yhteystiedot';

  onClearButtonClick = () => clearValues();

  notifyValuesUpdated = () => storeValues(this.state.valueMap);

  onSubmitButtonClick = () => {
    this.setSectionDone();
  };

}
