import _ from 'lodash';

const kieliUriRegExp = /^kieli_([a-z]+)#.+$/;

const postinumeroUriRegExp = /^posti_(.+)$/;

const prune = value => _.pickBy(value, v => !!v);

const getKieliByKieliUri = uri => {
  if (!_.isString(uri)) {
    return undefined;
  }

  const [, kieli] = uri.match(kieliUriRegExp) || [];

  return kieli;
};

const getPostinumeroByPostinumeroUri = uri => {
  if (!_.isString(uri)) {
    return undefined;
  }

  const [, postinumero] = uri.match(postinumeroUriRegExp) || [];

  return postinumero;
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

export default getOrganisaatioContactInfo;
