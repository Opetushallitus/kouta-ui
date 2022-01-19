import _ from 'lodash';

import { getPostinumeroByPostinumeroUri } from '#/src/utils';

const kieliUriRegExp = /^kieli_([a-z]+)#.+$/;

const prune = value => _.pickBy(value, v => !!v);

const getKieliByKieliUri = uri => {
  if (!_.isString(uri)) {
    return undefined;
  }

  const [, kieli] = uri.match(kieliUriRegExp) || [];

  return kieli;
};

const getOrganisaatioContactInfo = organisaatio => {
  const yhteystiedot = _.get(organisaatio, 'yhteystiedot') || [];

  const kayntiOsoitteet = yhteystiedot.filter(
    y => _.get(y, 'osoiteTyyppi') === 'kaynti'
  );

  const kayntiOsoitteetByKieli = _.groupBy(
    kayntiOsoitteet,
    ({ kieli }) => getKieliByKieliUri(kieli) || '_'
  );

  const verkkosivut = yhteystiedot.filter(y => _.isString(_.get(y, 'www')));
  const sahkopostit = yhteystiedot.filter(y => _.isString(_.get(y, 'email')));
  const puhelinnumerot = yhteystiedot.filter(
    y => _.get(y, 'tyyppi') === 'puhelin' && _.isString(_.get(y, 'numero'))
  );

  const verkkosivu = _.get(verkkosivut, '[0].www');
  const sahkoposti = _.get(sahkopostit, '[0].email');
  const puhelinnumero = _.get(puhelinnumerot, '[0].numero');
  const postinumero = _.get(kayntiOsoitteet, '[0].postinumeroUri')
    ? getPostinumeroByPostinumeroUri(kayntiOsoitteet[0].postinumeroUri)
    : undefined;

  const postinumeroKoodiUri = _.get(kayntiOsoitteet, '[0].postinumeroUri')
    ? _.get(kayntiOsoitteet, '[0].postinumeroUri')
    : null;

  const osoite = _.mapValues(kayntiOsoitteetByKieli, osoitteet => {
    return _.get(osoitteet, '[0].osoite');
  });

  const postitoimipaikka = _.mapValues(kayntiOsoitteetByKieli, osoitteet => {
    return _.get(osoitteet, '[0].postitoimipaikka')
      ? _.upperFirst(osoitteet[0].postitoimipaikka.toLowerCase())
      : undefined;
  });

  return {
    osoite: prune(_.omit(osoite, ['_'])),
    postitoimipaikka: prune(_.omit(postitoimipaikka, ['_'])),
    postinumero,
    sahkoposti,
    puhelinnumero,
    verkkosivu,
    postinumeroKoodiUri,
  };
};

export const getKielistettyOsoite = (osoitteet, ulkomaisetOsoitteet = []) => {
  const kielistetytOsoitteet = _.reduce(
    osoitteet,
    (result, osoite) => {
      const kieli = getKieliByKieliUri(osoite.kieli);

      const postitoimipaikka = osoite.postitoimipaikka
        ? _.upperFirst(osoite.postitoimipaikka.toLowerCase())
        : undefined;

      const address = {
        [kieli]: `${osoite.osoite}, ${getPostinumeroByPostinumeroUri(
          osoite.postinumeroUri
        )} ${postitoimipaikka}`,
      };

      return {
        ...result,
        ...address,
      };
    },
    {}
  );

  let enOsoite;
  const kieli = 'en';
  if (!_.has(kielistetytOsoitteet, kieli) && !_.isEmpty(ulkomaisetOsoitteet)) {
    const enUlkomainenOsoite = _.find(ulkomaisetOsoitteet, osoite => {
      return _.startsWith(osoite.kieli, 'kieli_en');
    });

    enOsoite = { [kieli]: enUlkomainenOsoite.osoite.replace(/\n/g, ', ') };
  }

  return { ...kielistetytOsoitteet, ...enOsoite };
};

export const getKielistetty = (entities, key) => {
  return entities.reduce((result, entity) => {
    const kieli = getKieliByKieliUri(entity.kieli);

    const kielistetty = {
      [kieli]: entity[key],
    };
    return {
      ...result,
      ...kielistetty,
    };
  }, {});
};

export const getKielistettyOrganisaatioContactInfo = yhteystiedot => {
  const sahkopostit = yhteystiedot.filter(yhteystieto =>
    _.has(yhteystieto, 'email')
  );

  const kayntiosoitteet = yhteystiedot.filter(
    yhteystieto => yhteystieto.osoiteTyyppi === 'kaynti'
  );
  const ulkomaisetKayntiosoitteet = yhteystiedot.filter(
    yhteystieto => yhteystieto.osoiteTyyppi === 'ulkomainen_kaynti'
  );

  const postiosoitteet = yhteystiedot.filter(
    yhteystieto => yhteystieto.osoiteTyyppi === 'posti'
  );
  const ulkomaisetPostiosoitteet = yhteystiedot.filter(
    yhteystieto => yhteystieto.osoiteTyyppi === 'ulkomainen_posti'
  );

  const puhelinnumerot = yhteystiedot.filter(
    yhteystieto => yhteystieto.tyyppi === 'puhelin'
  );

  const kielistetytYhteystiedot = {
    sahkoposti: getKielistetty(sahkopostit, 'email'),
    kaynti: getKielistettyOsoite(kayntiosoitteet, ulkomaisetKayntiosoitteet),
    posti: getKielistettyOsoite(postiosoitteet, ulkomaisetPostiosoitteet),
    puhelinnumero: getKielistetty(puhelinnumerot, 'numero'),
  };

  return _.omitBy(kielistetytYhteystiedot, _.isEmpty);
};

export default getOrganisaatioContactInfo;
