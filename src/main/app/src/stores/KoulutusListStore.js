import {APP_STATE_ACTIVE_KOULUTUS, APP_STATE_ACTIVE_KOULUTUSTYYPPI_CATEGORY, APP_STATE_KOULUTUS_LIST, APP_STATE_WORKFLOW} from '../config/states';
import {clearState, connectToOne, getState, updateState} from '../utils/stateUtils';
import {KOULUTUSTYYPPI_CATEGORY_TO_KOULUTUSTYYPPI_IDS_MAP, LANGUAGE} from '../config/constants';
import axios from 'axios/index';
import {urlKoulutuskoodit} from '../config/urls';

export const KoulutusListStore = () => {
  connectToOne(APP_STATE_WORKFLOW, {}, () => {
    clearState(APP_STATE_KOULUTUS_LIST);
    clearState(APP_STATE_ACTIVE_KOULUTUS);
  });
  connectToOne(APP_STATE_ACTIVE_KOULUTUSTYYPPI_CATEGORY, {}, (koulutustyyppi) => setKoulutusListIds(koulutustyyppi));
}

const setKoulutusListIds = (activeKoulutustyyppi) => {
  const idList = KOULUTUSTYYPPI_CATEGORY_TO_KOULUTUSTYYPPI_IDS_MAP[activeKoulutustyyppi];
  loadKoulutusLists(activeKoulutustyyppi, idList);
}

const setKoulutusListData = (koulutustyyyppi, koodiList) => {
  const optionsMap = {};
  koodiList.forEach((entry) => {
    const koodiUri = entry.koodiUri;
    const versio = entry.versio;
    const localizedMetadataEntry = entry.metadata.find(entry => entry.kieli === LANGUAGE);
    const nimi = localizedMetadataEntry.nimi;
    const kuvaus = localizedMetadataEntry.kuvaus;
    optionsMap[nimi] = {
      label: nimi,
      id: koodiUri + '-' + versio,
      koodiUri,
      versio,
      nimi,
      kuvaus,
      comparisonValue: nimi.toLowerCase()
    }
  });
  const koulutusOptions = Object.values(optionsMap);
  updateState(APP_STATE_KOULUTUS_LIST, {
    koulutusOptions
  })
};

export const getKoulutusOptionById = (koulutusId) => getState(APP_STATE_KOULUTUS_LIST, 'koulutusOptions').find(entry => entry.id === koulutusId);

const loadKoulutusLists = (koulutustyyppi, loadableIds, allLists) => {
  loadableIds = [...loadableIds] || [];
  allLists = allLists || [];

  const koulutusListId = loadableIds.shift();

  if (!koulutusListId) {
    return setKoulutusListData(koulutustyyppi, allLists);
  }

  axios.get(urlKoulutuskoodit(koulutusListId)).then((response) => {
    allLists = allLists.concat(response.data);
    loadKoulutusLists(koulutustyyppi, loadableIds, allLists)
  });
}



