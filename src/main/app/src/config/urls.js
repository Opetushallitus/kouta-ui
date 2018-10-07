import {ACTIVE_ENV} from './configuration';
import {SERVICE_DOMAINS} from './constants';

const SERVICE_DOMAIN = SERVICE_DOMAINS[ACTIVE_ENV];

export const  urlRelaatioAlakoodit = (koodiUri, versio) =>
    `${SERVICE_DOMAIN}/koodisto-service/rest/json/relaatio/sisaltyy-alakoodit/${koodiUri}?koodiVersio=${versio}`;

export const urlKoulutuskoodit = () =>
    `${SERVICE_DOMAIN}/koodisto-service/rest/json/koulutus/koodi?onlyValidKoodis=true`;