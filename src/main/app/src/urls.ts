import { isDev, isPlaywright } from './utils';

const { VITE_DEV_SERVER_URL, VITE_KOUTA_BACKEND_URL, VITE_KONFO_URL } =
  import.meta.env;

const koutaBackendDevUrl = `${
  VITE_KOUTA_BACKEND_URL || VITE_DEV_SERVER_URL
}/kouta-backend`;
const virkailijaDevUrl = VITE_DEV_SERVER_URL;
const ePerusteetDevUrl = `https://eperusteet.hahtuvaopintopolku.fi`;

const development = {
  'konfo-ui.koulutus': `${VITE_KONFO_URL}/koulutus/$1`,
  'konfo-ui.toteutus': `${VITE_KONFO_URL}/toteutus/$1`,
  'konfo-ui.oppilaitos': `${VITE_KONFO_URL}/oppilaitos/$1`,
  'konfo-ui.oppilaitoksenOsa': `${VITE_KONFO_URL}/oppilaitososa/$1`,
  'konfo-ui.valintaperuste': `${VITE_KONFO_URL}/valintaperuste/$1`,
  'kouta-backend.base-url': koutaBackendDevUrl,
  'kouta-backend.koulutus': `${koutaBackendDevUrl}/koulutus`,
  'kouta-backend.koulutus-by-oid': `${koutaBackendDevUrl}/koulutus/$1`,
  'kouta-backend.koulutus-list': `${koutaBackendDevUrl}/koulutus/list`,
  'kouta-backend.oppilaitostyypit-by-koulutustyypit': `${koutaBackendDevUrl}/koulutus/listOppilaitostyypitByKoulutustyypit`,
  'kouta-backend.koulutus-toteutukset': `${koutaBackendDevUrl}/koulutus/$1/toteutukset/list`,
  'kouta-backend.koodisto-koulutukset-by-ylakoodi': `${koutaBackendDevUrl}/koodisto/koulutukset/$1`,
  'kouta-backend.koodisto-valintakokeentyypit': `${koutaBackendDevUrl}/koodisto/valintakokeentyypit?hakutapakoodi=$1&haunkohdejoukkokoodi=$2`,
  'kouta-backend.toteutus': `${koutaBackendDevUrl}/toteutus`,
  'kouta-backend.toteutus-by-oid': `${koutaBackendDevUrl}/toteutus/$1`,
  'kouta-backend.toteutus-list': `${koutaBackendDevUrl}/toteutus/list`,
  'kouta-backend.toteutus-hakukohteet': `${koutaBackendDevUrl}/toteutus/$1/hakukohteet/list`,
  'kouta-backend.toteutus-opintojaksot': `${koutaBackendDevUrl}/toteutus/opintojaksot/list`,
  'kouta-backend.toteutus-copy': `${koutaBackendDevUrl}/toteutus/copy`,
  'kouta-backend.toteutukset-tilamuutos': `${koutaBackendDevUrl}/toteutus/tila/$1`,
  'kouta-backend.haku': `${koutaBackendDevUrl}/haku`,
  'kouta-backend.haku-by-oid': `${koutaBackendDevUrl}/haku/$1`,
  'kouta-backend.haku-list': `${koutaBackendDevUrl}/haku/list`,
  'kouta-backend.haku-hakukohteet': `${koutaBackendDevUrl}/haku/$1/hakukohteet/list`,
  'kouta-backend.hakukohde': `${koutaBackendDevUrl}/hakukohde`,
  'kouta-backend.hakukohde-by-oid': `${koutaBackendDevUrl}/hakukohde/$1`,
  'kouta-backend.hakukohde-tilamuutos-allowed': `${koutaBackendDevUrl}/hakukohde/$1/tila/$2`,
  'kouta-backend.hakukohteet-tilamuutos': `${koutaBackendDevUrl}/hakukohde/tila/$1`,
  'kouta-backend.valintaperuste': `${koutaBackendDevUrl}/valintaperuste`,
  'kouta-backend.valintaperuste-by-oid': `${koutaBackendDevUrl}/valintaperuste/$1`,
  'kouta-backend.valintaperuste-list': `${koutaBackendDevUrl}/valintaperuste/list`,
  'kouta-backend.ammattinimike-search': `${koutaBackendDevUrl}/ammattinimike/search/$1`,
  'kouta-backend.asiasana-search': `${koutaBackendDevUrl}/asiasana/search/$1`,
  'kouta-backend.login': `${koutaBackendDevUrl}/auth/login`,
  'kouta-backend.session': `${koutaBackendDevUrl}/auth/session`,
  'kouta-backend.soraKuvaus': `${koutaBackendDevUrl}/sorakuvaus`,
  'kouta-backend.soraKuvaus-by-oid': `${koutaBackendDevUrl}/sorakuvaus/$1`,
  'kouta-backend.soraKuvaus-list': `${koutaBackendDevUrl}/sorakuvaus/list`,
  'kouta-backend.oppilaitos': `${koutaBackendDevUrl}/oppilaitos`,
  'kouta-backend.oppilaitos-by-oid': `${koutaBackendDevUrl}/oppilaitos/$1`,
  'kouta-backend.oppilaitokset-by-oids': `${koutaBackendDevUrl}/oppilaitos/oppilaitokset`,
  'kouta-backend.oppilaitoksenOsa': `${koutaBackendDevUrl}/oppilaitoksen-osa`,
  'kouta-backend.oppilaitoksenOsa-by-oid': `${koutaBackendDevUrl}/oppilaitoksen-osa/$1`,
  'kouta-backend.organisaatio-by-oid': `${koutaBackendDevUrl}/organisaatio/$1`,
  'kouta-backend.organisaatiot-by-oids': `${koutaBackendDevUrl}/organisaatio/organisaatiot`,
  'kouta-backend.organisaatio-hierarkia': `${koutaBackendDevUrl}/organisaatio/hierarkia`,
  'kouta-backend.oppilaitos-organisaatiot-for-avoin-korkeakoulutus': `${koutaBackendDevUrl}/organisaatio/oppilaitokset-for-avoin-korkeakoulutus`,
  'kouta-backend.search.koulutukset': `${koutaBackendDevUrl}/search/koulutukset`,
  'kouta-backend.search.koulutus': `${koutaBackendDevUrl}/search/koulutus/$1`,
  'kouta-backend.search.toteutukset': `${koutaBackendDevUrl}/search/toteutukset`,
  'kouta-backend.search.haut': `${koutaBackendDevUrl}/search/haut`,
  'kouta-backend.search.hakukohteet': `${koutaBackendDevUrl}/search/hakukohteet`,
  'kouta-backend.search.valintaperusteet': `${koutaBackendDevUrl}/search/valintaperusteet`,
  'kouta-backend.upload-teemakuva': `${koutaBackendDevUrl}/upload/teemakuva`,
  'kouta-backend.upload-logo': `${koutaBackendDevUrl}/upload/logo`,
  'koodisto-service.base-url': `${virkailijaDevUrl}/koodisto-service`,
  'koodisto-service.sisaltyy-alakoodit': `${virkailijaDevUrl}/koodisto-service/rest/json/relaatio/sisaltyy-alakoodit/$1?koodiVersio=$2`,
  'koodisto-service.koodi': `${virkailijaDevUrl}/koodisto-service/rest/json/$1/koodi`,
  'koodisto-service.codeelement': `${virkailijaDevUrl}/koodisto-service/rest/codeelement/$1/$2`,
  'eperusteet-service.base-url': `${virkailijaDevUrl}/eperusteet-service`,
  'eperusteet-service.peruste-by-id': `${virkailijaDevUrl}/eperusteet-service/api/perusteet/$1`,
  'eperusteet-service.tutkinnonosankuvaukset': `${virkailijaDevUrl}/eperusteet-service/api/perusteenosat/$1`,
  'eperusteet-service.peruste-tutkinnonosat': `${virkailijaDevUrl}/eperusteet-service/api/perusteet/$1/suoritustavat/reformi/tutkinnonosat`,
  'eperusteet-service.peruste-rakenne': `${virkailijaDevUrl}/eperusteet-service/api/perusteet/$1/suoritustavat/reformi/rakenne`,
  'eperusteet-service.peruste-sisalto': `${virkailijaDevUrl}/eperusteet-service/api/perusteet/$1/suoritustavat/reformi/sisalto`,
  'eperusteet-service.perusteet-koulutuskoodilla': `${virkailijaDevUrl}/eperusteet-service/api/perusteet?tuleva=true&siirtyma=false&voimassaolo=true&poistunut=false&kieli=fi&koulutuskoodi=$1&tutkinnonosat=true`,
  'eperusteet-service.osaamisalakuvaukset': `${virkailijaDevUrl}/eperusteet-service/api/perusteet/$1/osaamisalakuvaukset`,
  'eperusteet-service.lukiodiplomit': `${virkailijaDevUrl}/eperusteet-service/api/perusteet/6828810/lops2019/oppiaineet/6835372`,
  'eperusteet-service.lukiodiplomi-tiedot': `${virkailijaDevUrl}/eperusteet-service/api/perusteet/6828810/lops2019/oppiaineet/6835372/moduulit/$1`,
  'lokalisaatio-service.localisation': `${virkailijaDevUrl}/lokalisointi/cxf/rest/v1/localisation?category=$1`,
  'kayttooikeus-service.omattiedot': `${virkailijaDevUrl}/kayttooikeus-service/henkilo/current/omattiedot`,
  'kayttooikeus-service.kayttajan-organisaatiot': `${virkailijaDevUrl}/kayttooikeus-service/organisaatiohenkilo/organisaatioOid`,
  'cas.login': `${virkailijaDevUrl}/cas/login`,
  ...(!isPlaywright && {
    'virkailija-raamit.raamitJs': `${virkailijaDevUrl}/virkailija-raamit/apply-raamit.js`,
  }),
  'lomake-editori.lomakkeet': `${virkailijaDevUrl}/lomake-editori/api/forms`,
  'lomake-editori.cas': `${virkailijaDevUrl}/lomake-editori/auth/cas`,
  'lomake-editori.muokkaus-sivu': `${virkailijaDevUrl}/lomake-editori/editor/$1`,
  'oppijanumerorekisteri-service.henkilo': `${virkailijaDevUrl}/oppijanumerorekisteri-service/henkilo/$1`,
  'oppijanumerorekisteri-service.asiointiKieli': `${virkailijaDevUrl}/oppijanumerorekisteri-service/henkilo/current/asiointiKieli`,
  'eperusteet.kooste': `${ePerusteetDevUrl}/#/$1/kooste/$2`,
  'eperusteet.tutkinnonosat': `${ePerusteetDevUrl}/#/$1/esitys/$2/reformi/tutkinnonosat/$3`,
  'eperusteet.sisalto': `${ePerusteetDevUrl}/#/$1/esitys/$2/reformi/sisalto/$3`,
  'hakukohderyhmapalvelu.haun-asetukset': `${virkailijaDevUrl}/hakukohderyhmapalvelu/haun-asetukset?hakuOid=$1`,
  'organisaatiopalvelu.organisaation-muokkaus-ui': `${virkailijaDevUrl}/organisaatio-service/lomake/$1`,
};

export const configure = async (urls, httpClient) => {
  if (isDev || isPlaywright) {
    urls.addProperties(development);
  } else {
    const { data } = await httpClient.get('/kouta/rest/config/frontProperties');
    urls.addProperties(data);
  }

  return urls;
};
