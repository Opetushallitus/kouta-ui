import _ from 'lodash';

import { getJulkaisutilaTranslationKey, JULKAISUTILA } from '#/src/constants';

export const getLabel = ({ status, t }) => {
  if (!_.isString(status)) {
    return null;
  }

  const labelByStatus = {
    [JULKAISUTILA.ARKISTOITU]: t(
      getJulkaisutilaTranslationKey(JULKAISUTILA.ARKISTOITU)
    ),
    [JULKAISUTILA.JULKAISTU]: t(
      getJulkaisutilaTranslationKey(JULKAISUTILA.JULKAISTU)
    ),
    [JULKAISUTILA.TALLENNETTU]: t(
      getJulkaisutilaTranslationKey(JULKAISUTILA.TALLENNETTU)
    ),
  };

  return labelByStatus[status] || null;
};

export const getColor = ({ theme, status }) => {
  let color = theme.colors.tallennettu;

  if (status === JULKAISUTILA.TALLENNETTU) {
    color = theme.colors.tallennettu;
  } else if (status === JULKAISUTILA.ARKISTOITU) {
    color = theme.colors.arkistoitu;
  } else if (status === JULKAISUTILA.JULKAISTU) {
    color = theme.colors.julkaistu;
  }

  return color;
};
