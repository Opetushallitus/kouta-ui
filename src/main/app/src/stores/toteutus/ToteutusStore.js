import {
    APP_STATE_TOTEUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES,
    APP_STATE_TOTEUTUKSEN_OSAAMISALA_SELECTIONS
} from "../../config/states";
import {getState, handleEvents, initState, updateState} from "../../utils/stateUtils";
import {APP_STATE_KOULUTUS_JSON} from "../koulutus/KoulutusStore";
import {APP_STATE_TOTEUTUKSEN_JARJESTAMISTIEDOT_OPTIONS} from "./ToteutuksenJarjestamistiedotStore";
import {APP_STATE_ORGANISAATION_TOIMIPISTE_SELECTIONS} from "../koulutus/KoulutuksenOrganisaatioStore";


export const APP_STATE_TOTEUTUS_JSON = "APP_STATE_TOTEUTUS_JSON";

export const ToteutusStore = () => {
    handleEvents({
        [APP_STATE_TOTEUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES]: (kielivalinta) => updateToteutus( {kielivalinta: kielivalinta} ),
        [APP_STATE_KOULUTUS_JSON]: (koulutus) => updateToteutus( {koulutusOid: koulutus.oid} ),
        [APP_STATE_TOTEUTUKSEN_OSAAMISALA_SELECTIONS]: (osaamisalat) => updateToteutus( appendToMetadata("osaamisalat", createOsaamisalaArray(osaamisalat))),
        [APP_STATE_TOTEUTUKSEN_JARJESTAMISTIEDOT_OPTIONS]: (jarjestamistiedot) => updateToteutus(appendToMetadata("opetus", createOpetusMetadata(jarjestamistiedot))),
        [APP_STATE_ORGANISAATION_TOIMIPISTE_SELECTIONS]: (toimipisteet) => updateToteutus(createToimipisteArray(toimipisteet))
        //nimi
        //yhteystiedot
        //asiasanat ja ammattinimikkeet
        //kuvaus, maksun määrä opetukseen
    });
    initState(APP_STATE_TOTEUTUS_JSON, {"muokkaaja": "1.2.3.2.2", metadata: {}});
};

const getToteutus = () => getState(APP_STATE_TOTEUTUS_JSON);

const updateToteutus = (value) => updateState(APP_STATE_TOTEUTUS_JSON, value);

const appendToMetadata = (key, value) => {
    return {
        metadata: {
            ...getToteutus().metadata,
            [key]: value
        }
    }
};

const createToimipisteArray = (toimipisteet) => { return {
    ...toimipisteet && { tarjoajat: Object.keys(toimipisteet).filter(k => toimipisteet[k]) }
}}

const createOsaamisalaArray = (osaamisalat) => Object.keys(osaamisalat).filter(
    k => osaamisalat[k] === true).map((o) => {return {koodiUri: o}});

const createOpetusMetadata = (j) => {
    return {
        ...j.opetuskieliOptions && { opetuskielet: j.opetuskieliOptions.filter(k => k.active).map(k => k.key) },
        ...j.opetusaikaOptions && {opetusaikaKoodiUri: j.opetusaikaOptions.find(k => k.active).key},
        ...j.opetustapaOptions && {opetustapaKoodiUri: j.opetustapaOptions.find(k => k.active).key},
        ...j.maksullisuusOptions && {onkoMaksullinen: j.maksullisuusOptions.find(k => k.key === "kylla").active},
        ...j.lisattavaOsioOptions && {osiot: j.lisattavaOsioOptions.filter(k => k.active).map(k => { return {otsikko: {fi: k.label}, teksti: {fi: k.value}}})}
        //maksunMaara: j.
        //kuvaus
    }
};