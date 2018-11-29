import {getState, handleEvents, initState, updateState} from "../../utils/stateUtils";
import {APP_STATE_KOULUTUS_JSON} from "../koulutus/KoulutusStore";
import {APP_STATE_TOTEUTUKSEN_JARJESTAMISTIEDOT_OPTIONS} from "./ToteutuksenJarjestamistiedotStore";
import {APP_STATE_ORGANISAATION_TOIMIPISTE_SELECTIONS} from "../koulutus/KoulutuksenOrganisaatioStore";
import {APP_STATE_TOTEUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES} from "./ToteutuksenKieliversioStore";
import {APP_STATE_TOTEUTUKSEN_OSAAMISALA_SELECTIONS} from "./ToteutuksenOsaamisalaStore";
import {APP_STATE_TOTEUTUKSEN_YHTEYSTIEDOT} from "./ToteutuksenYhteystiedotStore";
import {APP_STATE_TOTEUTUKSEN_NIMI_TRANSLATION_MAP} from "./ToteutuksenNimiStore";


export const APP_STATE_TOTEUTUS_JSON = "APP_STATE_TOTEUTUS_JSON";

export const ToteutusStore = () => {
    handleEvents({
        [APP_STATE_TOTEUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES]: (kielivalinta) => updateToteutus( {kielivalinta: kielivalinta} ),
        [APP_STATE_KOULUTUS_JSON]: (koulutus) => updateToteutus( {koulutusOid: koulutus.oid} ),
        [APP_STATE_TOTEUTUKSEN_OSAAMISALA_SELECTIONS]: (osaamisalat) => updateToteutus( appendToMetadata("osaamisalat", createOsaamisalaArray(osaamisalat))),
        [APP_STATE_TOTEUTUKSEN_JARJESTAMISTIEDOT_OPTIONS]: (jarjestamistiedot) => updateToteutus(appendToMetadata("opetus", createOpetusMetadata(jarjestamistiedot))),
        [APP_STATE_ORGANISAATION_TOIMIPISTE_SELECTIONS]: (toimipisteet) => updateToteutus(createToimipisteArray(toimipisteet)),
        [APP_STATE_TOTEUTUKSEN_YHTEYSTIEDOT]: (yhteystiedot) => updateToteutus( appendToMetadata("yhteystieto", yhteystiedot.valueMap)),
        [APP_STATE_TOTEUTUKSEN_NIMI_TRANSLATION_MAP]: (nimi) => updateToteutus( {nimi: nimi})
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