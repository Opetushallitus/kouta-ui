import {ACTIVE_ENV} from './configuration';
import {SERVICE_DOMAINS} from './constants';

const SERVICE_DOMAIN = SERVICE_DOMAINS[ACTIVE_ENV];

const buildUrl = (urlBody) => urlBody.indexOf('http') === 0 ? urlBody : SERVICE_DOMAIN + urlBody;

export const  urlRelaatioAlakoodit = (koodiUri, versio) =>
    buildUrl(`${SERVICE_DOMAIN}/koodisto-service/rest/json/relaatio/sisaltyy-alakoodit/${koodiUri}?koodiVersio=${versio}`);

export const urlKoulutuskoodit = (koulutustyyppiId) =>
    `${SERVICE_DOMAIN}/koodisto-service/rest/json/relaatio/sisaltyy-ylakoodit/${koulutustyyppiId}`;

export const urlEPerusteList = (koodiUri) =>
    `${SERVICE_DOMAIN}/eperusteet-service/api/perusteet?tuleva=true&siirtyma=false&voimassaolo=true&poistunut=false&kieli=fi&koulutuskoodi=${koodiUri}`;

export const urlOrganisaatioList = (parentOid) =>
    `${SERVICE_DOMAIN}/organisaatio-service/rest/organisaatio/v4/${parentOid}/children?includeImage=false`;

export const urlOsaamisalaKuvausList = (eperusteId) =>
  `${SERVICE_DOMAIN}/eperusteet-service/api/perusteet/${eperusteId}/osaamisalakuvaukset`;

export const urlHaunKohdejoukko = () =>
  `${SERVICE_DOMAIN}/koodisto-service/rest/json/haunkohdejoukko/koodi?onlyValidKoodis=true`;

export const workflowUrlToteutus = () => '/toteutus';

export const workflowUrlKoulutus = () => '/koulutus';

export const workflowUrlHaku = () => '/haku';

export const workflowUrlHakukohde = () => '/hakukohde';

export const workflowUrlValintaperusteet = () => '/valintaperusteet';
