import axios from 'axios';
import {getUrlKoutaBackendKoulutusList} from './UrlStore';
import {updateState} from '../utils/stateUtils';
import {APP_STATE_KOULUTUS_LIST, APP_STATE_KOULUTUS_OPTIONS} from '../config/states';
import {LANGUAGE} from '../config/constants';

export const KoulutusListStore = () => loadKoulutusList();

const loadKoulutusList = () => axios.get(getUrlKoutaBackendKoulutusList()).then(response => configureData(response.data));

const configureData = (koulutusList) => {
  setKoulutusOptions(koulutusList);
  setKoulutusList(koulutusList);
}

const setKoulutusList = (koulutusList) => updateState(APP_STATE_KOULUTUS_LIST, koulutusList);

const setKoulutusOptions = (koulutusList) => updateState(APP_STATE_KOULUTUS_OPTIONS, convertKoulutusListToOptions(koulutusList));

const convertKoulutusListToOptions = (koulutusList) => koulutusList.map(entry => ({
  label: entry.nimi[LANGUAGE.toLowerCase()],
  value: entry.oid
}));