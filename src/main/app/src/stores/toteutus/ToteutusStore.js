import {getState, handleEvents, initState, setState, updateState} from "../../utils/stateUtils";
import {
    APP_STATE_KOULUTUS_JSON, ATTR_SAVE,
    ATTR_SAVE_AND_PUBLISH
} from "../koulutus/KoulutusStore";
import {APP_STATE_TOTEUTUKSEN_JARJESTAMISTIEDOT_OPTIONS} from "./ToteutuksenJarjestamistiedotStore";
import {APP_STATE_ORGANISAATION_TOIMIPISTE_SELECTIONS} from "../koulutus/KoulutuksenOrganisaatioStore";
import {APP_STATE_TOTEUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES} from "./ToteutuksenKieliversioStore";
import {APP_STATE_TOTEUTUKSEN_OSAAMISALA_SELECTIONS} from "./ToteutuksenOsaamisalaStore";
import {APP_STATE_TOTEUTUKSEN_YHTEYSTIEDOT} from "./ToteutuksenYhteystiedotStore";
import {APP_STATE_TOTEUTUKSEN_NIMI_TRANSLATION_MAP} from "./ToteutuksenNimiStore";
import {REQUEST_STATUS} from "../../config/constants";
import axios from "axios";
import {urls} from "oph-urls-js";


export const APP_STATE_TOTEUTUS_JSON = "APP_STATE_TOTEUTUS_JSON";
export const APP_EVENT_AMMATTINIMIKE_INSERT = "APP_EVENT_AMMATTINIMIKE_INSERT";
export const APP_EVENT_AMMATTINIMIKE_DELETE = "APP_EVENT_AMMATTINIMIKE_DELETE";
export const APP_EVENT_ASIASANA_INSERT = "APP_EVENT_ASIASANA_INSERT";
export const APP_EVENT_ASIASANA_DELETE = "APP_EVENT_ASIASANA_DELETE";
export const APP_EVENT_SAVE_TOTEUTUS = "APP_EVENT_SAVE_TOTEUTUS";
export const APP_EVENT_SAVE_AND_PUBLISH_TOTEUTUS = "APP_EVENT_SAVE_AND_PUBLISH_TOTEUTUS";
export const APP_STATE_SAVE_TOTEUTUS = "APP_STATE_SAVE_TOTEUTUS";

export const ToteutusStore = () => {
    handleEvents({
        [APP_STATE_TOTEUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES]: (kielivalinta) => updateToteutus( {kielivalinta: kielivalinta} ),
        [APP_STATE_KOULUTUS_JSON]: (koulutus) => updateToteutus( {koulutusOid: koulutus.oid} ),
        [APP_STATE_TOTEUTUKSEN_OSAAMISALA_SELECTIONS]: (osaamisalat) => updateToteutus( appendToMetadata("osaamisalat", createOsaamisalaArray(osaamisalat))),
        [APP_STATE_TOTEUTUKSEN_JARJESTAMISTIEDOT_OPTIONS]: (jarjestamistiedot) => updateToteutus(appendToMetadata("opetus", createOpetusMetadata(jarjestamistiedot))),
        [APP_STATE_ORGANISAATION_TOIMIPISTE_SELECTIONS]: (toimipisteet) => updateToteutus(createToimipisteArray(toimipisteet)),
        [APP_STATE_TOTEUTUKSEN_YHTEYSTIEDOT]: (yhteystiedot) => updateToteutus( appendToMetadata("yhteystieto", yhteystiedot.valueMap)),
        [APP_STATE_TOTEUTUKSEN_NIMI_TRANSLATION_MAP]: (nimi) => updateToteutus( {nimi: nimi}),
        [APP_EVENT_AMMATTINIMIKE_INSERT]: (ammattinimike) => updateToteutus( appendAmmattinimike(ammattinimike)),
        [APP_EVENT_AMMATTINIMIKE_DELETE]: (ammattinimike) => updateToteutus( removeAmmattinimike(ammattinimike)),
        [APP_EVENT_ASIASANA_INSERT]: (asiasana) => updateToteutus(appendAsiasana(asiasana)),
        [APP_EVENT_ASIASANA_DELETE]: (asiasana) => updateToteutus(removeAsiasana(asiasana)),
        [APP_EVENT_SAVE_TOTEUTUS]: () => saveToteutus(),
        [APP_EVENT_SAVE_AND_PUBLISH_TOTEUTUS]: () => saveAndPublishToteutus()
        //nimi
        //yhteystiedot
        //asiasanat ja ammattinimikkeet
        //kuvaus, maksun määrä opetukseen
    });
    initState(APP_STATE_TOTEUTUS_JSON, {"muokkaaja": "1.2.3.2.2", metadata: {}});
    initState(APP_STATE_SAVE_TOTEUTUS, {
        [ATTR_SAVE_AND_PUBLISH]: REQUEST_STATUS.DISABLED,
        [ATTR_SAVE]: REQUEST_STATUS.ENABLED
    });
};

const getToteutus = () => getState(APP_STATE_TOTEUTUS_JSON);

const updateToteutus = (value) => updateState(APP_STATE_TOTEUTUS_JSON, value);

const removeAmmattinimike = (ammattinimike) => {
    let current = getToteutus().metadata.ammattinimikkeet;
    let newAmm = current ? current.filter((k) => k.arvo !== ammattinimike) : [];
    return appendToMetadata("ammattinimikkeet", newAmm)
};

const removeAsiasana = (asiasana) => {
    let current = getToteutus().metadata.asiasanat;
    let newAmm = current ? current.filter((k) => k.arvo !== asiasana) : [];
    return appendToMetadata("asiasanat", newAmm)
};

const appendAmmattinimike = (ammattinimike) => {
    let current = getToteutus().metadata.ammattinimikkeet;
    if(current) {
        if(!current.find((k) => k.arvo === ammattinimike)) {
            current.push({arvo: ammattinimike, kieli: 'fi'});
        }
    } else {
        current = [{arvo: ammattinimike, kieli: 'fi'}]
    }

    return appendToMetadata("ammattinimikkeet", current)
};

const appendAsiasana = (asiasana) => {
    let current = getToteutus().metadata.asiasanat;
    if(current) {
        if(!current.find((k) => k.arvo === asiasana)) {
            current.push({arvo: asiasana, kieli: 'fi'});
        }
    } else {
        current = [{arvo: asiasana, kieli: 'fi'}]
    }

    return appendToMetadata("asiasanat", current)
};

export const listAmmattinimikkeet = () => getToteutus().metadata.ammattinimikkeet;
export const listAsiasanat = () => getToteutus().metadata.asiasanat;

const appendToMetadata = (key, value) => {
    return {
        metadata: {
            ...getToteutus().metadata,
            [key]: value
        }
    }
};

const createToimipisteArray = (toimipisteet) => ({
    ...toimipisteet && { tarjoajat: Object.keys(toimipisteet).filter(k => toimipisteet[k]) }
});

const createOsaamisalaArray = (osaamisalat) => Object.keys(osaamisalat).filter(
    k => osaamisalat[k] === true).map((o) => {return {koodiUri: o}});

const createOpetusMetadata = (j) => {

    const hasActiveOptions = (name) => j[name] && j[name].find(k => k.active);

    return {
        ...hasActiveOptions("opetuskieliOptions") && { opetuskielet: j.opetuskieliOptions.filter(k => k.active).map(k => k.key) },
        ...hasActiveOptions("opetusaikaOptions") && {opetusaikaKoodiUri: j.opetusaikaOptions.find(k => k.active).key},
        ...hasActiveOptions("opetustapaOptions") && {opetustapaKoodiUri: j.opetustapaOptions.find(k => k.active).key},
        ...j.maksullisuusOptions && {onkoMaksullinen: j.maksullisuusOptions.find(k => k.key === "kylla").active},
        ...hasActiveOptions("lisattavaOsioOptions") && {osiot: j.lisattavaOsioOptions.filter(k => k.active).map(k => { return {otsikko: {fi: k.label}, teksti: {fi: k.value}}})},
        ...j.kuvaus && {kuvaus: j.kuvaus},
        ...j.maksullisuusOptions && j.maksullisuusOptions.find(k => k.key === "kylla").active && j.maksunMaara && {maksunMaara: j.maksunMaara}
        //maksunMaara: j.
        //kuvaus
    }
};

const saveStatus = (actionType, status) => updateState(APP_STATE_SAVE_TOTEUTUS, {
    [actionType]: status
});

const saveAndPublishToteutus = () => storeToteutus({...getToteutus(), tila: 'julkaistu'},
    () => saveStatus(ATTR_SAVE_AND_PUBLISH, REQUEST_STATUS.SUCCESS),
    () => saveStatus(ATTR_SAVE_AND_PUBLISH, REQUEST_STATUS.FAILURE));

const saveToteutus = () => {
    const toteutus = getToteutus();
    storeToteutus( toteutus.tila ? toteutus : {...toteutus, tila: 'tallennettu'},
        () => saveStatus(ATTR_SAVE, REQUEST_STATUS.SUCCESS),
        () => saveStatus(ATTR_SAVE, REQUEST_STATUS.FAILURE));
};

const storeToteutus = (toteutus, onSuccess, onFailure) => {
    if(!toteutus.oid) {
        axios.put(urls.url('kouta-backend.toteutus'), toteutus)
            .then(r => { httpGetToteutus(r.data.oid); onSuccess();})
            .catch(e => onFailure());
    } else {
        axios.post(urls.url('kouta-backend.toteutus'), toteutus, {headers: {'If-Unmodified-Since': toteutus.lastModified}})
            .then(r => { httpGetToteutus(toteutus.oid); onSuccess();})
            .catch(e => onFailure());
    }
};

const httpGetToteutus = (oid) => {
    axios.get(urls.url('kouta-backend.toteutus-by-oid', oid))
        .then(r => {
            console.log(r);
            setState(APP_STATE_TOTEUTUS_JSON, {...r.data, lastModified: r.headers['last-modified']});
        })
        .catch(r => console.log("TODO: error handle"))
};