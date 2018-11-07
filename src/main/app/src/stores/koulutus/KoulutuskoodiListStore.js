import {
  APP_EVENT_CLEAR_KOULUTUSTYYPPI_SECTION,
  APP_STATE_ACTIVE_KOULUTUSTYYPPI_CATEGORY,
  APP_STATE_KOULUTUSKOODI_LIST
} from '../../config/states';
import {getState, handleEvents, updateState} from '../../utils/stateUtils';
import {KOULUTUSTYYPPI_CATEGORY_TO_KOULUTUSTYYPPI_IDS_MAP, LANGUAGE} from '../../config/constants';
import axios from 'axios/index';
import {urlKoulutuskoodit} from '../../config/urls';

export const KoulutuskoodiListStore = () => handleEvents({
  [APP_STATE_ACTIVE_KOULUTUSTYYPPI_CATEGORY]: (koulutustyyppi) => setKoulutuskoodiListIds(koulutustyyppi),
  [APP_EVENT_CLEAR_KOULUTUSTYYPPI_SECTION]: () => clearKoulutuskoodiList()
});

const setKoulutuskoodiListIds = (activeKoulutustyyppi) => {
  const idList = KOULUTUSTYYPPI_CATEGORY_TO_KOULUTUSTYYPPI_IDS_MAP[activeKoulutustyyppi];
  if (!idList) {
    return;
  }
  loadKoulutuskoodiLists(activeKoulutustyyppi, idList);
}

const clearKoulutuskoodiList = () => updateState(APP_STATE_KOULUTUSKOODI_LIST, {
  koulutusOptions: []
});

const setKoulutusListData = (koulutustyyyppi, koodiList) => {
  const optionsMap = {};
  koodiList.forEach((entry) => {
    const koodiUri = entry.koodiUri;
    const koodiArvo = entry.koodiArvo;
    const versio = entry.versio;
    const localizedMetadataEntry = entry.metadata.find(entry => entry.kieli === LANGUAGE);
    const nameTranslationMap = {};
    entry.metadata.forEach(entry => {nameTranslationMap[entry['kieli'].toLowerCase()] = entry.nimi});
    const nimi = localizedMetadataEntry.nimi;
    const koodistoUri = entry.koodisto.koodistoUri;
    const kuvaus = localizedMetadataEntry.kuvaus;
    optionsMap[nimi] = {
      label: nimi,
      id: koodiUri + '-' + versio,
      koodiArvo,
      koodiUri,
      koodistoUri,
      versio,
      nimi,
      kuvaus,
      nameTranslationMap,
      comparisonValue: nimi.toLowerCase()
    }
  });
  const koulutusOptions = Object.values(optionsMap);
  updateState(APP_STATE_KOULUTUSKOODI_LIST, {
    koulutusOptions
  })
};

export const getKoulutusOptionById = (koulutusId) => getState(APP_STATE_KOULUTUSKOODI_LIST, 'koulutusOptions')
  .find(entry => entry.id === koulutusId);

const loadKoulutuskoodiLists = (koulutustyyppi, loadableIds, allLists) => {
  loadableIds = [...loadableIds] || [];
  allLists = allLists || [];

  const koulutusListId = loadableIds.shift();

  if (!koulutusListId) {
    return setKoulutusListData(koulutustyyppi, allLists);
  }

  axios.get(urlKoulutuskoodit(koulutusListId)).then((response) => {
    allLists = allLists.concat(response.data);
    loadKoulutuskoodiLists(koulutustyyppi, loadableIds, allLists)
  });
}



