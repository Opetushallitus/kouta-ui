import React from 'react';
import {connectListener} from '../../../utils/stateUtils';
import {AbstractSection} from '../../../components/AbstractSection';
import {InputField} from '../../../components/InputField';
import {APP_STATE_TOTEUTUKSEN_YHTEYSTIEDOT, clearValues, storeValues} from '../../../stores/toteutus/ToteutuksenYhteystiedotStore';
import {APP_STATE_TOTEUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES} from '../../../stores/toteutus/ToteutuksenKieliversioStore';

export class ToteutuksenYhteystiedotSection extends AbstractYhteystiedotSection {

  getStateNameForYhteystiedot = () => APP_STATE_TOTEUTUKSEN_YHTEYSTIEDOT;

  getStateNameForSupportedLanguages = () => APP_STATE_TOTEUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES;

  getClassName = () => 'ToteutuksenYhteystiedotSection';

  getHeader = () => 'Koulutuksen yhteystiedot';

  onClearButtonClick = () => clearValues();

  onSubmitButtonClick = () => {
    storeValues(this.state);
    this.setSectionDone();
  };

}
