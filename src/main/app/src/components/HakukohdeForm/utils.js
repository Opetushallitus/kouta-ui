import get from 'lodash/get';

import { getOrganisaatioContactInfo } from '../../apiUtils';

export const getLiiteToimituspaikkaFieldValues = ({
  organisaatio,
  language,
}) => {
  const yhteystiedot = getOrganisaatioContactInfo(organisaatio);

  return {
    toimitusosoite: { [language]: get(yhteystiedot, 'osoite') || '' },
    toimituspostinumero: get(yhteystiedot, 'postinumero') || '',
    toimituspostitoimipaikka: {
      [language]: get(yhteystiedot, 'postitoimipaikka') || '',
    },
    toimitussahkoposti: get(yhteystiedot, 'sahkoposti') || '',
  };
};
