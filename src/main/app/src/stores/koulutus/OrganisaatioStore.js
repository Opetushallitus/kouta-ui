import axios from 'axios';
import {urlOrganisaatioList} from '../../config/urls';
import {
  APP_EVENT_ORGANISAATIO_SELECTION_CHANGE,
  APP_EVENT_ORGANISAATIO_SELECTION_CLEAR,
  APP_STATE_KOULUTUS_DETAILS,
  APP_STATE_ORGANISAATIO_OPTIONS,
  APP_STATE_ORGANISAATIO_SELECTIONS
} from '../../config/states';
import {
  clearState,
  containsValue,
  getState,
  handleEvents,
  initStates,
  setState,
  updateState
} from '../../utils/stateUtils';
import {getLanguage} from '../generic/LanguageStore';

//REPLACE THIS WITH OID COMING FROM CAS
const DEFAULT_OID = '1.2.246.562.10.594252633210';

export const OrganisaatioStore = () => {
  handleEvents({
    [APP_STATE_KOULUTUS_DETAILS]: () => loadOrganisaatioList(DEFAULT_OID),
    [APP_EVENT_ORGANISAATIO_SELECTION_CHANGE]: (selection) => selectOrganisaatio(selection.value, selection.selected),
    [APP_EVENT_ORGANISAATIO_SELECTION_CLEAR]: () => clearOrganisaatioSelections()
  });
  initStates({
    [APP_STATE_ORGANISAATIO_OPTIONS]: [],
    [APP_STATE_ORGANISAATIO_SELECTIONS]: {}
  });
}

const excludesOrganisaatioList = () => !containsValue(APP_STATE_ORGANISAATIO_OPTIONS, 'options');

export const selectOrganisaatio = (activeOrganisaatioId, selected) => {
  updateState(APP_STATE_ORGANISAATIO_SELECTIONS, {
    [activeOrganisaatioId]: selected
  });
  loadToimipisteList();
};

export const clearOrganisaatioSelections = () => clearState(APP_STATE_ORGANISAATIO_SELECTIONS);

export const getSelectedOrganisaatioOidList = () => {
  const selections = getOrganisaatioSelections();
  return Object.keys(selections).reduce((selectedOids, organisaatioOid) => {
    selections[organisaatioOid] && selectedOids.push(organisaatioOid);
    return selectedOids;
  }, []);
}

const getOrganisaatioSelections = () => getState(APP_STATE_ORGANISAATIO_SELECTIONS);

const loadOrganisaatioList = (parentOid) => excludesOrganisaatioList() ?
  axios.get(urlOrganisaatioList(parentOid))
    .then((response) => setOrganisaatioOptionsData(response.data)) : null;

const setOrganisaatioOptionsData = (jsonData) =>
  setState(APP_STATE_ORGANISAATIO_OPTIONS, extractOrganisaatioOptions(jsonData));

const extractOrganisaatioOptions = (jsonData) =>
  jsonData.filter(entry => entry.tyypit.includes('organisaatiotyyppi_02') && entry.status !== 'PASSIIVINEN')
    .map((entry) => ({
    label: entry.nimi[getLanguage()],
    key: entry.oid
  }));

export const APP_STATE_ORGANISAATION_TOIMIPISTE_ENTRIES = 'APP_STATE_ORGANISAATION_TOIMIPISTE_ENTRIES';
const loadNextToimipiste = (organisaatioOids, entries) => {
  if (organisaatioOids.length === 0) {
    return setState(APP_STATE_ORGANISAATION_TOIMIPISTE_ENTRIES, entries);
  }
  const organisaatioOid = organisaatioOids.shift();
  const url = urlOrganisaatioList(organisaatioOid);
  axios.get(url).then(response => {
    const toimipisteEntry = createToimipisteEntry(response.data, organisaatioOid);
    entries.push(toimipisteEntry);
    loadNextToimipiste(organisaatioOids, entries);
  });
};

const extractToimipisteOptions = (jsonData) =>
  jsonData.map((entry) => ({
    label: entry.nimi[getLanguage()],
    key: entry.oid
  }));

const createToimipisteEntry = (data, organisaatioOid) => {
  const toimipisteOptions = extractToimipisteOptions(data);
  const organisaationNimi = getOrganisaatioNameByOid(organisaatioOid);
  return {
    organisaationNimi,
    toimipisteOptions,
    organisaatioOid
  };
};

const getOrganisaatioNameByOid = (organisaatioOid) =>
  getState(APP_STATE_ORGANISAATIO_OPTIONS).find(entry => entry.key === organisaatioOid).label;

export const loadToimipisteList = () => {
  const organisaatioOids = getSelectedOrganisaatioOidList();
  const options = [];
  loadNextToimipiste(organisaatioOids, options);
};

export const APP_STATE_ORGANISAATION_TOIMIPISTE_SELECTIONS = 'APP_STATE_ORGANISAATION_TOIMIPISTE_SELECTIONS';
export const selectToimipiste = (toimipisteOid, active) => updateState(APP_STATE_ORGANISAATION_TOIMIPISTE_SELECTIONS, {
  [toimipisteOid]: active
});
