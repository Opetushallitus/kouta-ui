import axios from 'axios';
import {urlKoulutuskoodit, urlOrganisaatiot} from '../config/urls';
import {APP_STATE_ACTIVE_KOULUTUS, APP_STATE_KOULUTUS_LIST, APP_STATE_KOULUTUSTYYPPI} from '../config/states';
import {getState, observe, updateState} from '../utils/utils';
import {getId, getSelectedOptions} from '../model/Koulutuskoodi';

export const KoulutusListStore = () => {
  configureKoulutustyyppiOptions();
};

export const configureKoulutustyyppiOptions = () => observe(APP_STATE_KOULUTUSTYYPPI, {
  koulutustyyppiOptions: [
    {
      value: 'amm',
      label: 'Ammatillinen koulutus'
    },
    {
      value: 'kk',
      label: 'Korkeakoulukoulutus'
    },
    {
      value: 'lk',
      label: 'Lukiokoulutus'
    }
  ]
});

export const selectKoulutustyyppi = (value) => {
  setKoulutustyyppi(value);
  loadKoulutusList();
};

const setKoulutustyyppi = (activeKoulutustyyppi) => updateState(APP_STATE_KOULUTUSTYYPPI, {activeKoulutustyyppi});

export const getKoulutustyyppi = () => getState(APP_STATE_KOULUTUSTYYPPI, 'activeKoulutustyyppi');

const loadKoulutusList = () => axios.get(urlKoulutuskoodit()).then((response) => setKoulutusListData(response.data));

const setKoulutusListData = (koodiList) => {
  const koulutusMap = {};
  const koodiSelectionList = [];
  let koulutuskoodi;
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

export const selectKoulutus = (activeKoulutusId) => {
  const activeKoulutus = getActiveKoulutusById(activeKoulutusId);
  updateState(APP_STATE_ACTIVE_KOULUTUS, {
    activeKoulutusId,
    activeKoulutus
  });
};

