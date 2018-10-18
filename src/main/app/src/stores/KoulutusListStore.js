import axios from 'axios';
import {urlKoulutuskoodit} from '../config/urls';
import {APP_STATE_ACTIVE_KOULUTUS, APP_STATE_KOULUTUS_LIST, APP_STATE_KOULUTUSTYYPPI, APP_STATE_WORKFLOW} from '../config/states';
import {clearState, clearValues, connectToOne, getState, updateState} from '../utils/stateUtils';
import {getId, getSelectedOptions} from '../model/Koulutuskoodi';

export const KoulutusListStore = () => {
  connectToOne(APP_STATE_WORKFLOW, {}, () => {
    clearState(APP_STATE_KOULUTUS_LIST);
    clearState(APP_STATE_ACTIVE_KOULUTUS);
  });
  connectToOne(APP_STATE_KOULUTUSTYYPPI, {}, (koulutustyyppi) => loadKoulutusList());
}

const loadKoulutusList = () => axios.get(urlKoulutuskoodit()).then((response) => setKoulutusListData(response.data));

const setKoulutusListData = (koodiList) => {
  const koulutusMap = {};
  let koulutusOptions = [];
  koodiList.forEach((koulutuskoodi) => {
    let id = getId(koulutuskoodi);
    koulutusMap[id] = koulutuskoodi;
    let options = getSelectedOptions(koulutuskoodi);
    koulutusOptions = koulutusOptions.concat(options);
  });
  updateState(APP_STATE_KOULUTUS_LIST, {
    koulutusMap,
    koulutusOptions
  })
};

export const getActiveKoulutusById = (activeKoulutusId) => {
  const koulutusMap = getState(APP_STATE_KOULUTUS_LIST, 'koulutusMap');
  return koulutusMap[activeKoulutusId];
}

export const deselectKoulutus = () => clearValues(APP_STATE_ACTIVE_KOULUTUS);

export const selectKoulutus = (activeKoulutusId) => {
  const activeKoulutus = getActiveKoulutusById(activeKoulutusId);
  updateState(APP_STATE_ACTIVE_KOULUTUS, {
    activeKoulutusId,
    activeKoulutus
  });
};

