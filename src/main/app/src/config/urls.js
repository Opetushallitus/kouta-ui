import {ACTIVE_ENV} from './configuration';
import {SERVICE_DOMAINS} from './constants';

const SERVICE_DOMAIN = SERVICE_DOMAINS[ACTIVE_ENV];

const buildUrl = (urlBody) => urlBody.indexOf('http') === 0 ? urlBody : SERVICE_DOMAIN + urlBody;

export const  urlRelaatioAlakoodit = (koodiUri, versio) =>
    buildUrl(`${SERVICE_DOMAIN}/koodisto-service/rest/json/relaatio/sisaltyy-alakoodit/${koodiUri}?koodiVersio=${versio}`);

export const urlKoulutuskoodit = (koulutustyyppiId) =>
    `${SERVICE_DOMAIN}/koodisto-service/rest/json/relaatio/sisaltyy-ylakoodit/${koulutustyyppiId}`;

export const urlKoulutuksenKuvaus = (koodiUri) =>
    `${SERVICE_DOMAIN}/eperusteet-service/api/perusteet?tuleva=true&siirtyma=true&voimassaolo=true&poistunut=true&kieli=fi&koulutuskoodi=${koodiUri}`;

export const urlOrganisaatioList = () =>
    `${SERVICE_DOMAIN}/organisaatio-service/rest/organisaatio/v4/hae?aktiiviset=true&suunnitellut=true&lakkautetut=false&organisaatiotyyppi=organisaatiotyyppi_02`;

export const workflowUrlToteutus = () => '/toteutus';

export const workflowUrlKoulutus = () => '/koulutus';

export const workflowUrlHaku = () => '/haku';

export const workflowUrlHakukohde = () => '/hakukohde';

export const workflowUrlValintaperusteet = () => '/valintaperusteet';

export const workflowUrlYhteenveto = () => '/yhteenveto';