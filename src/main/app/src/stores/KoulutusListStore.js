import axios from 'axios';
import {getUrlKoutaBackendKoulutusList} from './UrlStore';
import {updateState} from '../utils/stateUtils';
import {APP_STATE_KOULUTUS_LIST} from '../config/states';

export const KoulutusListStore = () => loadKoulutusList();

const loadKoulutusList = () => axios.get(getUrlKoutaBackendKoulutusList()).then(response => setKoulutusList(response.data));

const setKoulutusList = (koulutusList) => updateState(APP_STATE_KOULUTUS_LIST, koulutusList);