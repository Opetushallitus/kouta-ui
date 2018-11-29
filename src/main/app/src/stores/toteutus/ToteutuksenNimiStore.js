import {NimiStore} from '../generic/NimiStore';
import {EVENT_TRANSLATION_CHANGE, EVENT_TRANSLATION_CLEAR, STATE_TRANSLATION_MAP} from '../../config/scopes/Nimi';
import {APP_STATE_KOULUTUS_JSON} from "../koulutus/KoulutusStore";
import {handleEvent, initState, updateState, getState} from "../../utils/stateUtils";
import {APP_STATE_TOTEUTUKSEN_JARJESTAMISTIEDOT_OPTIONS} from "./ToteutuksenJarjestamistiedotStore";

export const APP_STATE_TOTEUTUKSEN_NIMI_TRANSLATION_MAP = 'APP_STATE_TOTEUTUKSEN_NIMI_TRANSLATION_MAP';
export const APP_EVENT_TOTEUTUKSEN_NIMI_TRANSLATION_CHANGE = 'APP_EVENT_TOTEUTUKSEN_NIMI_TRANSLATION_CHANGE';
export const APP_EVENT_TOTEUTUKSEN_NIMI_TRANSLATION_CLEAR = 'APP_EVENT_TOTEUTUKSEN_NIMI_TRANSLATION_CLEAR';

export const SCOPE_TOTEUTUKSEN_NIMI = {
  [STATE_TRANSLATION_MAP]: APP_STATE_TOTEUTUKSEN_NIMI_TRANSLATION_MAP,
  [EVENT_TRANSLATION_CHANGE]: APP_EVENT_TOTEUTUKSEN_NIMI_TRANSLATION_CHANGE,
  [EVENT_TRANSLATION_CLEAR]: APP_EVENT_TOTEUTUKSEN_NIMI_TRANSLATION_CLEAR
};

export const ToteutuksenNimiStore = () => {
  NimiStore(SCOPE_TOTEUTUKSEN_NIMI);
  initState(SCOPE_TOTEUTUKSEN_NIMI, initKoulutuksenNimi());
  handleEvent(APP_STATE_KOULUTUS_JSON, (koulutus) => notifyKoulutusNimiUpdate(koulutus.nimi));
  handleEvent(APP_STATE_TOTEUTUKSEN_JARJESTAMISTIEDOT_OPTIONS, (jarjestamistiedot) => notifyJarjestamistiedotUpdate(jarjestamistiedot))
};

const readKoulutusNimiFromState = () => getState(APP_STATE_KOULUTUS_JSON).nimi;
const readOpetusaikaFromState = () => findOpetusaika(getState(APP_STATE_TOTEUTUKSEN_JARJESTAMISTIEDOT_OPTIONS));

const initKoulutuksenNimi = () =>
    storeNimi(readKoulutusNimiFromState(), readOpetusaikaFromState());

const notifyJarjestamistiedotUpdate = (jarjestamistiedot) =>
    storeNimi(readKoulutusNimiFromState(), findOpetusaika(jarjestamistiedot));

const notifyKoulutusNimiUpdate = (koulutusNimi) =>
    storeNimi(koulutusNimi, readOpetusaikaFromState());

const findOpetusaika = (jarjestamistiedot) => {
  let activeOption = jarjestamistiedot.opetusaikaOptions.find(k => k.active);
  return activeOption && activeOption.label.toLowerCase();
};

const storeNimi = (koulutusNimi, opetusaika) => {
  let opetusaikaAppend = opetusaika ? ", " + opetusaika : "";
  updateState(APP_STATE_TOTEUTUKSEN_NIMI_TRANSLATION_MAP, {
      fi: koulutusNimi["fi"] + opetusaikaAppend, //TODO: opetusajan käännös
      sv: koulutusNimi["sv"] + opetusaikaAppend,
      en: koulutusNimi["en"] + opetusaikaAppend
  });
};