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

  const postiOsoitteet = yhteystiedot.filter(
    y => _.get(y, 'osoiteTyyppi') === 'posti'
  );

  const postiOsoitteetByKieli = _.groupBy(
    postiOsoitteet,
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

  const kayntipostinumero = _.get(kayntiOsoitteet, '[0].postinumeroUri')
    ? getPostinumeroByPostinumeroUri(kayntiOsoitteet[0].postinumeroUri)
    : undefined;

  const kayntipostinumeroKoodiUri = _.get(kayntiOsoitteet, '[0].postinumeroUri')
    ? _.get(kayntiOsoitteet, '[0].postinumeroUri')
    : null;

  const kayntiosoite = _.mapValues(kayntiOsoitteetByKieli, osoitteet => {
    return _.get(osoitteet, '[0].osoite');
  });

  const kayntipostitoimipaikka = _.mapValues(
    kayntiOsoitteetByKieli,
    osoitteet => {
      return _.get(osoitteet, '[0].postitoimipaikka')
        ? _.upperFirst(osoitteet[0].postitoimipaikka.toLowerCase())
        : undefined;
    }
  );

  const postinumero = _.get(postiOsoitteet, '[0].postinumeroUri')
    ? getPostinumeroByPostinumeroUri(postiOsoitteet[0].postinumeroUri)
    : undefined;

  const osoite = _.mapValues(postiOsoitteetByKieli, osoitteet => {
    return _.get(osoitteet, '[0].osoite');
  });

  const postitoimipaikka = _.mapValues(postiOsoitteetByKieli, osoitteet => {
    return _.get(osoitteet, '[0].postitoimipaikka')
      ? _.upperFirst(osoitteet[0].postitoimipaikka.toLowerCase())
      : undefined;
  });

  return {
    kaynti: {
      osoite: prune(_.omit(kayntiosoite, ['_'])),
      postitoimipaikka: prune(_.omit(kayntipostitoimipaikka, ['_'])),
      postinumero: kayntipostinumero,
    },
    posti: {
      osoite: prune(_.omit(osoite, ['_'])),
      postitoimipaikka: prune(_.omit(postitoimipaikka, ['_'])),
      postinumero: postinumero,
    },
    osoite: prune(_.omit(kayntiosoite, ['_'])),
    postitoimipaikka: prune(_.omit(kayntipostitoimipaikka, ['_'])),
    postinumero: kayntipostinumero,
    sahkoposti,
    puhelinnumero,
    verkkosivu,
    postinumeroKoodiUri: kayntipostinumeroKoodiUri,
  };
};

export const getKielistettyOsoite = (osoitteet, ulkomaisetOsoitteet = []) => {
  const kielistetytOsoitteet = _.reduce(
    osoitteet,
    (result, osoite) => {
      const kieli = getKieliByKieliUri(osoite.kieli);

      const katuosoite = {
        [kieli]: osoite.osoite,
      };

      const postitoimipaikka = {
        [kieli]: osoite.postitoimipaikka
          ? _.upperFirst(osoite.postitoimipaikka.toLowerCase())
          : undefined,
      };

      const postinumero = {
        [kieli]: getPostinumeroByPostinumeroUri(osoite.postinumeroUri),
      };

      return {
        katuosoite: { ...result.katuosoite, ...katuosoite },
        postinumero: { ...result.postinumero, ...postinumero },
        postitoimipaikka: { ...result.postitoimipaikka, ...postitoimipaikka },
      };
    },
    {}
  );

  let enOsoite;
  const kieli = 'en';
  if (
    !_.has(kielistetytOsoitteet.katuosoite, kieli) &&
    !_.isEmpty(ulkomaisetOsoitteet)
  ) {
    const enUlkomainenOsoite = _.find(ulkomaisetOsoitteet, {
      kieli: 'kieli_en#1',
    });

    enOsoite = { ulkomainenOsoite: { [kieli]: enUlkomainenOsoite.osoite } };
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
