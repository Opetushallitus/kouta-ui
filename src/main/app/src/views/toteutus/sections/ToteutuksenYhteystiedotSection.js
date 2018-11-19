import React from 'react';
import {
  APP_STATE_TOTEUTUKSEN_YHTEYSTIEDOT, clearValues,
  storeValues
} from '../../../stores/toteutus/ToteutuksenYhteystiedotStore';
import {AbstractYhteystiedotSection} from '../../../components/AbstractYhteystiedotSection';
import {APP_STATE_TOTEUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES} from "../../../stores/toteutus/ToteutuksenKieliversioStore";

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
