import axios from 'axios';
import {handleEvent, initStates, updateState} from '../../utils/stateUtils';
import {LANGUAGE} from '../../config/constants';

import {
  EVENT_MODE,
  STATE_ENTRY_LIST,
  STATE_ENTRY_OPTIONS,
  STATE_MODE,
  STATE_MODE_OPTIONS
} from '../../config/scopes/PohjanValinta';

export const PohjanValintaStore = (scope, listRetrievalUrl, modeOptions) => {
  handleEvent(scope[EVENT_MODE], (mode) => updateState(
    scope[STATE_MODE], mode
  ));
  initStates({
    [scope[STATE_MODE_OPTIONS]]: modeOptions
  });
  //TODO: Listaa ei pitäisi hakea vielä tässä vaiheessa, vaan vasta sitten, kun käyttäjä avaa näkymän! Nyt tulee turhia kutsuja.
  loadSavedEntries(scope, listRetrievalUrl);
};

const loadSavedEntries = (scope, listRetrievalUrl) =>
  axios.get(listRetrievalUrl).then(response => configureData(scope, response.data));

const configureData = (scope, koulutusList) => {
  setEntryOptions(scope, koulutusList);
  setEntryList(scope, koulutusList);
};

const setEntryList = (scope, koulutusList) =>
  updateState(scope[STATE_ENTRY_LIST], koulutusList);

const setEntryOptions = (scope, koulutusList) =>
  updateState(scope[STATE_ENTRY_OPTIONS], convertListToOptions(koulutusList));

const convertListToOptions = (koulutusList) => koulutusList.map(entry => ({
  label: entry.nimi[LANGUAGE.toLowerCase()],
  value: entry.oid
}));
