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
  clearState, containsValue, getState, handleEvents, setState,
  updateState
} from '../../utils/stateUtils';
import {extractOrganisaatioOptions} from '../../model/Organisaatio';

export const OrganisaatioStore = () => {
  handleEvents({
    [APP_STATE_KOULUTUS_DETAILS]: () => loadOrganisaatioList(),
    [APP_EVENT_ORGANISAATIO_SELECTION_CHANGE]: (selection) => selectOrganisaatio(selection.value, selection.selected),
    [APP_EVENT_ORGANISAATIO_SELECTION_CLEAR]: () => clearOrganisaatioSelections()
  });
  setState(APP_STATE_ORGANISAATIO_OPTIONS, []);
  setState(APP_STATE_ORGANISAATIO_SELECTIONS, {});
}

const excludesOrganisaatioList = () => !containsValue(APP_STATE_ORGANISAATIO_OPTIONS, 'options');

export const selectOrganisaatio = (activeOrganisaatioId, selected) => updateState(APP_STATE_ORGANISAATIO_SELECTIONS, {
  [activeOrganisaatioId]: selected
});

export const clearOrganisaatioSelections = () => clearState(APP_STATE_ORGANISAATIO_SELECTIONS);

export const getSelectedOrganisaatioOidList = () => {
  const selections = getOrganisaatioSelections();
  return Object.keys(selections).reduce((selectedOids, organisaatioOid) => {
    selections[organisaatioOid] && selectedOids.push(organisaatioOid);
    return selectedOids;
  }, []);
}

const getOrganisaatioSelections = () => getState(APP_STATE_ORGANISAATIO_SELECTIONS);

const loadOrganisaatioList = () => excludesOrganisaatioList() ?
    axios.get(urlOrganisaatioList()).then((response) => setOrganisaatioOptionsData(response.data)) : null;

const setOrganisaatioOptionsData = (jsonData) =>
    updateState(APP_STATE_ORGANISAATIO_OPTIONS, extractOrganisaatioOptions(jsonData));

