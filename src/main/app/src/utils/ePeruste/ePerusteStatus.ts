import _ from 'lodash';
import { setLightness } from 'polished';
import { css } from 'styled-components';

import {
  EPERUSTE_STATUS_TULEVA,
  EPERUSTE_STATUS_VOIMASSA,
} from '#/src/constants';

export const getEPerusteStatus = ePeruste => {
  if (ePeruste) {
    const { voimassaoloAlkaa, voimassaoloLoppuu } = ePeruste;
    const now = Date.now();
    if (
      voimassaoloAlkaa &&
      voimassaoloAlkaa < now &&
      (_.isNil(voimassaoloLoppuu) || voimassaoloLoppuu > now)
    ) {
      return EPERUSTE_STATUS_VOIMASSA;
    } else if (voimassaoloAlkaa > now) {
      return EPERUSTE_STATUS_TULEVA;
    }
  }
};

const getStatusColors = ({ status, theme }) => {
  switch (status) {
    case EPERUSTE_STATUS_TULEVA:
      return {
        backgroundColor: setLightness(0.9, theme.palette.success.main),
        color: theme.palette.success.main,
      };
    case EPERUSTE_STATUS_VOIMASSA:
      return {
        backgroundColor: setLightness(0.9, theme.palette.primary.main),
        color: theme.palette.primary.main,
      };
    default:
      return {
        backgroundColor: 'inherit',
        color: 'inherit',
      };
  }
};

export const getEPerusteStatusCss = ({ status, theme }) => {
  const { backgroundColor, color } = getStatusColors({ status, theme });
  return css`
    background-color: ${backgroundColor};
    color: ${color};
  `;
};
