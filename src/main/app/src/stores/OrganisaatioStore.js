import axios from 'axios';
import {urlOrganisaatioList} from '../config/urls';
import {APP_STATE_KOULUTUS_DETAILS, APP_STATE_ORGANISAATIO, APP_STATE_ORGANISAATIO_SELECTION_MAP} from '../config/states';
import {clearState, connectToOne, containsValue, getState, setState, updateState} from '../utils/stateUtils';
import {extractOrganisaatioOptions} from '../model/Organisaatio';

export const OrganisaatioStore = () => {
  connectToOne(APP_STATE_KOULUTUS_DETAILS, {}, () => {
    loadOrganisaatioList()
  });
  setState(APP_STATE_ORGANISAATIO_SELECTION_MAP, {});
}

const excludesOrganisaatioList = () => !containsValue(APP_STATE_ORGANISAATIO, 'options');

export const selectOrganisaatio = (activeOrganisaatioId, selected) => updateState(APP_STATE_ORGANISAATIO_SELECTION_MAP, {
  [activeOrganisaatioId]: selected
});

export const clearOrganisaatioSelections = () => clearState(APP_STATE_ORGANISAATIO_SELECTION_MAP);

const getOrganisaatioSelectionMap = () => getState(APP_STATE_ORGANISAATIO_SELECTION_MAP);

export const getSelectedOrganisaatioOidList = () => {
  const organisaatioSelectionMap = getOrganisaatioSelectionMap();

  const oids = Object.keys(organisaatioSelectionMap).reduce((selectedOids, organisaatioOid) => {
    organisaatioSelectionMap[organisaatioOid] === true && selectedOids.push(organisaatioOid);
    return selectedOids;
  }, []);
  return oids;
}

const loadOrganisaatioList = () => excludesOrganisaatioList() ?
    axios.get(urlOrganisaatioList()).then((response) => setOrganisaatioOptionsData(response.data)) : null;

const setOrganisaatioOptionsData = (jsonData) => {
  updateState(APP_STATE_ORGANISAATIO, {
    options: extractOrganisaatioOptions(jsonData)
  })
}

