import axios from 'axios';
import {urlOrganisaatioList, urlOrganisaatiot} from '../config/urls';
import {APP_STATE_KOULUTUS_DETAILS, APP_STATE_ORGANISAATIO} from '../config/states';
import {connect, updateState} from '../utils/utils';
import {extractOrganisaatioOptions} from '../model/Organisaatio';

export const OrganisaatioStore = () => {
  connect(APP_STATE_KOULUTUS_DETAILS, {}, () => loadOrganisaatioList());
}

export const selectOrganisaatio = (activeOrganisaatioId) => updateState(APP_STATE_ORGANISAATIO, {activeOrganisaatioId});

const loadOrganisaatioList = () => axios.get(urlOrganisaatioList()).then((response) => setOrganisaatioOptionsData(response.data));

const setOrganisaatioOptionsData = (jsonData) => updateState(APP_STATE_ORGANISAATIO, {
    options: extractOrganisaatioOptions(jsonData)
})

