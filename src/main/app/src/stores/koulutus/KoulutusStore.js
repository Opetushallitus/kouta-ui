import axios from 'axios';
import {getState, handleEvents, initState, setState, updateState} from '../../utils/stateUtils';
import {getUrlKoutaBackendKoulutus} from '../generic/UrlStore';
import {REQUEST_STATUS} from '../../config/constants';
import {APP_EVENT_ORGANISAATIO_SELECTION_CHANGE} from './KoulutuksenOrganisaatioStore';
import {APP_EVENT_SECTION_VALIDATION_REQUEST} from '../generic/SectionStateStore';
import {APP_STATE_KOULUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES} from './KoulutuksenKieliversioStore';

export const APP_STATE_KOULUTUS_JSON = "APP_STATE_KOULUTUS_JSON";
export const APP_STATE_SAVE_KOULUTUS = "APP_STATE_SAVE_KOULUTUS";
export const APP_EVENT_SELECT_KOULUTUSTYYPPI = 'APP_EVENT_SELECT_KOULUTUSTYYPPI';
export const APP_EVENT_SELECT_KOULUTUSKOODI = "APP_EVENT_SELECT_KOULUTUSKOODI";
export const APP_EVENT_SAVE_KOULUTUS = "APP_EVENT_SAVE_KOULUTUS";
export const APP_EVENT_SAVE_AND_PUBLISH_KOULUTUS = "APP_EVENT_SAVE_AND_PUBLISH_KOULUTUS";

export const ATTR_SAVE_AND_PUBLISH = 'saveAndPublish';
export const ATTR_SAVE = 'save';

export const KoulutusStore = () => {
    handleEvents({
        [APP_EVENT_SELECT_KOULUTUSTYYPPI]: (koulutustyyppi) => updateKoulutus( {koulutustyyppi: koulutustyyppi} ),
        [APP_EVENT_SELECT_KOULUTUSKOODI]: (koulutuskoodiOption) => updateKoulutuskoodi(koulutuskoodiOption),
        [APP_STATE_KOULUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES]: (kielivalinta) => updateKoulutus( {kielivalinta: kielivalinta} ),
        [APP_EVENT_ORGANISAATIO_SELECTION_CHANGE]: (organisaatio) => updateKoulutus( {tarjoajat: [ organisaatio.value ] } ),
        [APP_EVENT_SECTION_VALIDATION_REQUEST]: (state) => validateKoulutus(getKoulutus()),
        [APP_EVENT_SAVE_KOULUTUS]: () => saveKoulutus(),
        [APP_EVENT_SAVE_AND_PUBLISH_KOULUTUS]: () => saveAndPublishKoulutus()
    });
    initState(APP_STATE_KOULUTUS_JSON, {johtaaTutkintoon : true, "muokkaaja": "1.2.3.2.2"});
    initState(APP_STATE_SAVE_KOULUTUS, {
        [ATTR_SAVE_AND_PUBLISH]: REQUEST_STATUS.DISABLED,
        [ATTR_SAVE]: REQUEST_STATUS.ENABLED
    });
};

const getKoulutus = () => getState(APP_STATE_KOULUTUS_JSON);

const updateKoulutus = (value) => updateState(APP_STATE_KOULUTUS_JSON, value);

const updateKoulutuskoodi = (koulutuskoodiOption) => updateKoulutus({
    koulutusKoodiUri: koulutuskoodiOption ? koulutuskoodiOption.koodiUri + "#" + koulutuskoodiOption.versio : undefined,
    nimi: koulutuskoodiOption ? koulutuskoodiOption.nameTranslationMap : undefined
});

const isKoulutusValid = (koulutus) => {
    const isFieldEmpty = (fieldValue) => typeof fieldValue === 'undefined' || fieldValue === null || fieldValue === false;

    return koulutus &&
    !isFieldEmpty(koulutus.koulutusKoodiUri) &&
    !isFieldEmpty(koulutus.koulutusKoodiUri) &&
    koulutus.kielivalinta && koulutus.kielivalinta.length > 0 &&
    koulutus.tarjoajat && koulutus.tarjoajat.length > 0 &&
    koulutus.nimi && koulutus.nimi.keys > 0
};

const validateKoulutus = () => updateState(APP_STATE_SAVE_KOULUTUS, {
    [ATTR_SAVE_AND_PUBLISH]: isKoulutusValid() ? REQUEST_STATUS.DISABLED : REQUEST_STATUS.ENABLED
});

const saveStatus = (actionType, status) => updateState(APP_STATE_SAVE_KOULUTUS, {
    [actionType]: status
});

const saveAndPublishKoulutus = () => storeKoulutus({...getKoulutus(), tila: 'julkaistu'},
    () => saveStatus(ATTR_SAVE_AND_PUBLISH, REQUEST_STATUS.SUCCESS),
    () => saveStatus(ATTR_SAVE_AND_PUBLISH, REQUEST_STATUS.FAILURE));

const saveKoulutus = () => {
    const koulutus = getKoulutus();
    storeKoulutus( koulutus.tila ? koulutus : {...koulutus, tila: 'tallennettu'},
                  () => saveStatus(ATTR_SAVE, REQUEST_STATUS.SUCCESS),
                  () => saveStatus(ATTR_SAVE, REQUEST_STATUS.FAILURE));
};

const storeKoulutus = (koulutus, onSuccess, onFailure) => {
    if(!koulutus.oid) {
        axios.put(getUrlKoutaBackendKoulutus(), koulutus)
            .then(r => { httpGetKoulutus(r.data.oid); onSuccess();})
            .catch(e => onFailure());
    } else {
        axios.post(getUrlKoutaBackendKoulutus(), koulutus, {headers: {'If-Unmodified-Since': koulutus.lastModified}})
            .then(r => { httpGetKoulutus(koulutus.oid); onSuccess();})
            .catch(e => onFailure());
    }
};

const httpGetKoulutus = (oid) => {
    axios.get(getUrlKoutaBackendKoulutus() + "/" + oid)
         .then(r => {
             console.log(r);
             setState(APP_STATE_KOULUTUS_JSON, {...r.data, lastModified: r.headers['last-modified']});
         })
         .catch(r => console.log("TODO: error handle"))
};
