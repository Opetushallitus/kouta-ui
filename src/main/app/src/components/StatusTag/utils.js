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
