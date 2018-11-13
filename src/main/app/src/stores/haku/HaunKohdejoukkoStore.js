import axios from 'axios';
import {handleEvent, setState} from '../../utils/stateUtils';
import {APP_STATE_WORKFLOW} from '../generic/WorkflowStore';
import {WORKFLOW} from '../../config/constants';
import {urlHaunKohdejoukko} from '../../config/urls';
import {matchLanguage} from '../generic/LanguageStore';

export const APP_STATE_HAUN_KOHDEJOUKKO_OPTIONS = 'APP_STATE_HAUN_KOHDEJOUKKO_OPTIONS';

export const HaunKohdejoukkoStore = () => handleEvent(APP_STATE_WORKFLOW,
  (workflow) => workflow === WORKFLOW.HAKU && loadHaunKohdejoukkoList(workflow));

const loadHaunKohdejoukkoList = (workflow) =>
  axios.get(urlHaunKohdejoukko()).then(response => configureHaunKohdejoukkoOptions(response.data));

const configureHaunKohdejoukkoOptions = (data) => setState(APP_STATE_HAUN_KOHDEJOUKKO_OPTIONS, data.map(entry => ({
  key: entry.koodiUri,
  label: entry.metadata.find(entry => matchLanguage(entry.kieli)).nimi
})));
