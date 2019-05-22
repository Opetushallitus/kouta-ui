import upperFirst from 'lodash/upperFirst';
import get from 'lodash/get';

import { isString } from './index';

export const getOrganisaatioContactInfo = organisaatio => {
  const postitoimipaikka = get(organisaatio, 'kayntiosoite.postitoimipaikka');
  const postinumeroUri = get(organisaatio, 'kayntiosoite.postinumeroUri');
  const [, postinumero] = postinumeroUri ? postinumeroUri.split('_') : [];
  const sahkopostiYhteystieto = (get(organisaatio, 'yhteystiedot') || []).find(
    ({ email }) => isString(email),
  );
  const sahkoposti = sahkopostiYhteystieto ? sahkopostiYhteystieto.email : null;

  return {
    osoite: get(organisaatio, 'kayntiosoite.osoite') || null,
    postitoimipaikka: postitoimipaikka
      ? upperFirst(postitoimipaikka.toLowerCase())
      : null,
    postinumero: postinumero || null,
    sahkoposti,
  };
};
