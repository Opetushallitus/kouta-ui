import React from 'react';
import {
  APP_STATE_TOTEUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES,
  APP_STATE_TOTEUTUKSEN_YHTEYSTIEDOT
} from '../../../config/states';
import {clearValues, storeValues} from '../../../stores/toteutus/ToteutuksenYhteystiedotStore';
import {AbstractYhteystiedotSection} from '../../../components/AbstractYhteystiedotSection';

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
