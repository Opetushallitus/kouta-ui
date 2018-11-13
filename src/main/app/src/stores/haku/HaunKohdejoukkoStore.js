import axios from 'axios';
import {clearState, handleEvents, initState, setState} from '../../utils/stateUtils';
import {APP_STATE_WORKFLOW} from '../generic/WorkflowStore';
import {WORKFLOW} from '../../config/constants';
import {urlHaunKohdejoukko} from '../../config/urls';
import {matchLanguage} from '../generic/LanguageStore';

export const APP_STATE_HAUN_KOHDEJOUKKO_OPTIONS = 'APP_STATE_HAUN_KOHDEJOUKKO_OPTIONS';
export const APP_STATE_HAUN_KOHDEJOUKKO_SELECTIONS = 'APP_STATE_HAUN_KOHDEJOUKKO_SELECTIONS';
export const APP_EVENT_HAUN_KOHDEJOUKKO_SELECTION_CHANGE = 'APP_EVENT_HAUN_KOHDEJOUKKO_SELECTION_CHANGE';
export const APP_EVENT_HAUN_KOHDEJOUKKO_SELECTION_CLEAR = 'APP_EVENT_ORGANISAATIO_SELECTION_CLEAR';

export const HaunKohdejoukkoStore = () => {
  handleEvents({
    [APP_STATE_WORKFLOW]: (workflow) => workflow === WORKFLOW.HAKU && loadHaunKohdejoukkoList(),
    [APP_EVENT_HAUN_KOHDEJOUKKO_SELECTION_CHANGE]: (selection) => selectHaunKohdejoukko(selection.value, selection.selected),
    [APP_EVENT_HAUN_KOHDEJOUKKO_SELECTION_CLEAR]: () => clearHaunKohdejoukkoSelections()
  });
  initState(APP_STATE_HAUN_KOHDEJOUKKO_SELECTIONS, {});
  loadHaunKohdejoukkoList();
};

const loadHaunKohdejoukkoList = () =>
  axios.get(urlHaunKohdejoukko()).then(response => configureHaunKohdejoukkoOptions(response.data));

const configureHaunKohdejoukkoOptions = (data) => setState(APP_STATE_HAUN_KOHDEJOUKKO_OPTIONS, data.map(entry => ({
  key: entry.koodiUri,
  label: entry.metadata.find(entry => matchLanguage(entry.kieli)).nimi
})));

const clearHaunKohdejoukkoSelections = () => clearState(APP_STATE_HAUN_KOHDEJOUKKO_SELECTIONS);

export const selectHaunKohdejoukko = (haunKohdejoukkoId, selected) => setState(APP_STATE_HAUN_KOHDEJOUKKO_SELECTIONS, {
  [haunKohdejoukkoId]: selected
});
