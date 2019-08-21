import { isString } from '../../utils';
import { JULKAISUTILA } from '../../constants';

export const getLabel = ({ status, t }) => {
  if (!isString(status)) {
    return null;
  }

  const labelByStatus = {
    [JULKAISUTILA.ARKISTOITU]: t('julkaisutilat.arkistoitu'),
    [JULKAISUTILA.JULKAISTU]: t('julkaisutilat.julkaistu'),
    [JULKAISUTILA.TALLENNETTU]: t('julkaisutilat.tallennettu'),
  };

  return labelByStatus[status] || null;
};

export const getColor = ({ theme, status }) => {
  let color = theme.palette.primary.main;

  if (status === JULKAISUTILA.TALLENNETTU) {
    color = theme.palette.primary.main;
  } else if (status === JULKAISUTILA.ARKISTOITU) {
    color = theme.palette.warning.main;
  } else if (status === JULKAISUTILA.JULKAISTU) {
    color = theme.palette.success.main;
  }

  return color;
};
