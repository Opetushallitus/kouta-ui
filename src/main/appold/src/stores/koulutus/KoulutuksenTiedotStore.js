import axios from 'axios';
import {AlakoodiList} from '../../model/Alakoodi';
import {clearValues, handleEvents, initState, setState, updateState} from '../../utils/stateUtils';
import {LANGUAGE} from '../../config/constants';
import {urls} from 'oph-urls-js';
import {APP_EVENT_SELECT_KOULUTUSKOODI, APP_EVENT_SELECT_KOULUTUSTYYPPI} from './KoulutusStore';

export const APP_STATE_KOULUTUKSEN_TIEDOT = 'APP_STATE_KOULUTUKSEN_TIEDOT';

export const KoulutuksenTiedotStore = () => {
  handleEvents({
    [APP_EVENT_SELECT_KOULUTUSTYYPPI]: (koulutustyyppi) => { if(!koulutustyyppi) { clearKoulutusDetails() }},
    [APP_EVENT_SELECT_KOULUTUSKOODI]: (koulutuskoodiOption) => { if(!koulutuskoodiOption) { deselectKoulutus() } else { loadKoulutusDetails(koulutuskoodiOption) }}
  });
  initKoulutuksenTiedot();
};

const initKoulutuksenTiedot = () => initState(APP_STATE_KOULUTUKSEN_TIEDOT, { enabled: false });

const updateKoulutuksenTiedot = (stateUpdate) => updateState(APP_STATE_KOULUTUKSEN_TIEDOT, stateUpdate);

const deselectKoulutus = () => clearValues(APP_STATE_KOULUTUKSEN_TIEDOT);

const clearKoulutusDetails = () => setState(APP_STATE_KOULUTUKSEN_TIEDOT, {
    enabled: false
});

const loadKoulutusDetails = (koulutusOption) => {
  updateKoulutuksenTiedot({
    ...koulutusOption,
    enabled: false,
    koodiUri: koulutusOption.koodiUri,
    versio: koulutusOption.versio
  });
  axios.get(urls.url('koodisto-service.sisaltyy-alakoodit', koulutusOption.koodiUri, koulutusOption.versio))
  .then((response) => setKoulutusDetailsData(response.data));
};

const setKoulutusDetailsData = (alakoodiJsonArray) => {
  const alakoodiList = AlakoodiList.createFromJsonArray(alakoodiJsonArray);
  updateKoulutuksenTiedot({
    koulutusala: AlakoodiList.findKoulutusala(alakoodiList, LANGUAGE),
    tutkintonimikeList: AlakoodiList.findTutkintonimikeList(alakoodiList, LANGUAGE),
    opintojenLaajuus: AlakoodiList.findOpintojenLaajuus(alakoodiList, LANGUAGE),
    opintojenLaajuusyksikko: AlakoodiList.findOpintojenLaajuusyksikko(alakoodiList, LANGUAGE),
    enabled: true
  });
};
