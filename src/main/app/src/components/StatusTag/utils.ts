import _ from 'lodash';

import { getJulkaisutilaTranslationKey, JULKAISUTILA } from '#/src/constants';

export type StatusTagProps = {
  status?: JULKAISUTILA | JULKAISUTILA[keyof JULKAISUTILA];
  color?: string;
  children?: React.ReactNode;
};

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
  return theme.colors[status] ?? theme.colors.tallennettu;
};
