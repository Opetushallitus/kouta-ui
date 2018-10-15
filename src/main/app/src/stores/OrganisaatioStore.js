import axios from 'axios';
import {urlOrganisaatioList} from '../config/urls';
import {APP_STATE_KOULUTUS_DETAILS, APP_STATE_ORGANISAATIO} from '../config/states';
import {connect, containsState, updateState} from '../utils/utils';
import {extractOrganisaatioOptions} from '../model/Organisaatio';

export const OrganisaatioStore = () => connect(APP_STATE_KOULUTUS_DETAILS, {}, () => loadOrganisaatioList());

const excludesOrganisaatioList = () => !containsState(APP_STATE_ORGANISAATIO, 'options');

export const selectOrganisaatio = (activeOrganisaatioId) => updateState(APP_STATE_ORGANISAATIO, {activeOrganisaatioId});

const loadOrganisaatioList = () => excludesOrganisaatioList() ?
    axios.get(urlOrganisaatioList()).then((response) => setOrganisaatioOptionsData(response.data)) : null;

const setOrganisaatioOptionsData = (jsonData) => updateState(APP_STATE_ORGANISAATIO, {
    options: extractOrganisaatioOptions(jsonData)
})

