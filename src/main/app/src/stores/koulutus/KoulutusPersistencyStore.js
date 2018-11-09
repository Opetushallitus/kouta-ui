import axios from 'axios';
import {getKoodiUri, getVersio} from './KoulutusDetailsStore';
import {getKoulutustyyppiCategory} from './KoulutustyyppiCategoryStore';
import {getUrlKoutaBackendKoulutus} from '../generic/UrlStore';
import {JULKAISUTILA, REQUEST_STATUS} from '../../config/constants';
import {handleEvent, initState, updateState} from '../../utils/stateUtils';
import {APP_EVENT_SECTION_VALIDATION_REQUEST, APP_STATE_KOULUTUS_PERSISTENCY} from '../../config/states';
import {getSelectedOrganisaatioOidList} from './OrganisaatioStore';
import {getTranslationMapByLanguages} from './KoulutuksenNimiStore';
import {getSupportedLanguages} from './KoulutuksenKieliversioStore'

export const ATTR_SAVE_AND_PUBLISH = 'saveAndPublish';
export const ATTR_SAVE = 'save';

export const KoulutusPersistencyStore = () => {
  initState(APP_STATE_KOULUTUS_PERSISTENCY, {
    [ATTR_SAVE_AND_PUBLISH]: REQUEST_STATUS.DISABLED,
    [ATTR_SAVE]: REQUEST_STATUS.ENABLED
  });
  handleEvent(APP_EVENT_SECTION_VALIDATION_REQUEST, (state) => validateKoulutus());
}

const isFieldEmpty = (fieldValue) => typeof fieldValue === 'undefined' || fieldValue === null || fieldValue === false;

const isAnyOrganisaatioSelected = () => getSelectedOrganisaatioOidList().length > 0;

const hasNameTranslations = () => Object.keys(getTranslationMapByLanguages(getSupportedLanguages())).length > 0;

const isAnyKoulutusFieldEmpty = () => [getKoulutustyyppiCategory(), getKoodiUri(), getVersio(), hasNameTranslations(), isAnyOrganisaatioSelected()]
.filter((entry) => isFieldEmpty(entry)).length > 0;

const validateKoulutus = () => updateState(APP_STATE_KOULUTUS_PERSISTENCY, {
  [ATTR_SAVE_AND_PUBLISH]: isAnyKoulutusFieldEmpty() ? REQUEST_STATUS.DISABLED : REQUEST_STATUS.ENABLED
});

const buildJson = (julkaisutila) => ({
  "kielivalinta": getSupportedLanguages(),
  "johtaaTutkintoon": true,
  "koulutustyyppi": getKoulutustyyppiCategory(),
  "koulutusKoodiUri": getKoodiUri() + "#" + getVersio(),
  "tila": julkaisutila,
  "tarjoajat": getSelectedOrganisaatioOidList(),
  "nimi": getTranslationMapByLanguages(getSupportedLanguages()),
  "muokkaaja": "1.2.3.2.2"
});

const createKoulutus = (actionType, julkaisutila) =>
    axios.put(getUrlKoutaBackendKoulutus(), buildJson(julkaisutila))
    .then(r => setButtonStatus(actionType, REQUEST_STATUS.SUCCESS))
    .catch(e => setButtonStatus(actionType, REQUEST_STATUS.FAILURE));

export const saveAndPublishKoulutus = () => createKoulutus(ATTR_SAVE_AND_PUBLISH, JULKAISUTILA.JULKAISTU);

export const saveKoulutus = () => createKoulutus(ATTR_SAVE, JULKAISUTILA.TALLENNETTU);

const setButtonStatus = (actionType, status) => updateState(APP_STATE_KOULUTUS_PERSISTENCY, {
  [actionType]: status
});
