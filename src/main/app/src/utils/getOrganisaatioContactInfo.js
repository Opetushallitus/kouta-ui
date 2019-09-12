import upperFirst from 'lodash/upperFirst';
import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';
import omit from 'lodash/omit';
import pickBy from 'lodash/pickBy';
import get from 'lodash/get';

import { isString } from './index';

const kieliUriRegExp = /^kieli_([a-z]+)#.+$/;

const postinumeroUriRegExp = /^posti_(.+)$/;

const prune = value => pickBy(value, v => !!v);

const getKieliByKieliUri = uri => {
  if (!isString(uri)) {
    return undefined;
  }

  const [, kieli] = uri.match(kieliUriRegExp) || [];

  return kieli;
};

const getPostinumeroByPostinumeroUri = uri => {
  if (!isString(uri)) {
    return undefined;
  }

  const [, postinumero] = uri.match(postinumeroUriRegExp) || [];

  return postinumero;
};

const getOrganisaatioContactInfo = organisaatio => {
  const yhteystiedot = get(organisaatio, 'yhteystiedot') || [];

  const kayntiOsoitteet = yhteystiedot.filter(
    y => get(y, 'osoiteTyyppi') === 'kaynti',
  );

  const kayntiOsoitteetByKieli = groupBy(
    kayntiOsoitteet,
    ({ kieli }) => getKieliByKieliUri(kieli) || '_',
  );

  const verkkosivut = yhteystiedot.filter(y => isString(get(y, 'www')));
  const sahkopostit = yhteystiedot.filter(y => isString(get(y, 'email')));
  const puhelinnumerot = yhteystiedot.filter(
    y => get(y, 'tyyppi') === 'puhelin' && isString(get(y, 'numero')),
  );

  const verkkosivu = get(verkkosivut, '[0].www');
  const sahkoposti = get(sahkopostit, '[0].email');
  const puhelinnumero = get(puhelinnumerot, '[0].numero');
  const postinumero = get(kayntiOsoitteet, '[0].postinumeroUri')
    ? getPostinumeroByPostinumeroUri(kayntiOsoitteet[0].postinumeroUri)
    : undefined;

  const postinumeroKoodiUri = get(kayntiOsoitteet, '[0].postinumeroUri')
    ? get(kayntiOsoitteet, '[0].postinumeroUri')
    : null;

  const osoite = mapValues(kayntiOsoitteetByKieli, osoitteet => {
    return get(osoitteet, '[0].osoite');
  });

  const postitoimipaikka = mapValues(kayntiOsoitteetByKieli, osoitteet => {
    return get(osoitteet, '[0].postitoimipaikka')
      ? upperFirst(osoitteet[0].postitoimipaikka.toLowerCase())
      : undefined;
  });

  return {
    osoite: prune(omit(osoite, ['_'])),
    postitoimipaikka: prune(omit(postitoimipaikka, ['_'])),
    postinumero,
    sahkoposti,
    puhelinnumero,
    verkkosivu,
    postinumeroKoodiUri,
  };
};

export default getOrganisaatioContactInfo;
