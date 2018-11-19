import React from 'react';
import {
  APP_STATE_HAUN_KIELIVERSIO_SUPPORTED_LANGUAGES,
  APP_STATE_TOTEUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES
} from '../../../config/states';

import {AbstractYhteystiedotSection} from '../../../components/AbstractYhteystiedotSection';
import {APP_STATE_HAUN_YHTEYSTIEDOT, clearValues, storeValues} from '../../../stores/haku/HaunYhteystiedotStore';

export class HaunYhteystiedotSection extends AbstractYhteystiedotSection {

  getStateNameForYhteystiedot = () => APP_STATE_HAUN_YHTEYSTIEDOT;

  getStateNameForSupportedLanguages = () => APP_STATE_HAUN_KIELIVERSIO_SUPPORTED_LANGUAGES;

  getClassName = () => 'HaunYhteystiedotSection';

  getHeader = () => 'Haun yhteystiedot';

  onClearButtonClick = () => clearValues();

  onSubmitButtonClick = () => {
    storeValues(this.state);
    this.setSectionDone();
  };

}
