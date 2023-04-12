import _ from 'lodash';
import { setLightness } from 'polished';
import { css } from 'styled-components';

import {
  EPERUSTE_STATUS_TULEVA,
  EPERUSTE_STATUS_VOIMASSA,
} from '#/src/constants';
import { Theme } from '#/src/theme';

export type EPerusteStatus = 'voimassa' | 'tuleva';

export const getEPerusteStatus = ePeruste => {
  if (ePeruste) {
    const { voimassaoloAlkaa, voimassaoloLoppuu } = ePeruste;
    const now = Date.now();
    if (
      voimassaoloAlkaa &&
      voimassaoloAlkaa < now &&
      (_.isNil(voimassaoloLoppuu) || voimassaoloLoppuu > now)
    ) {
      return 'voimassa' as EPerusteStatus;
    } else if (voimassaoloAlkaa > now) {
      return 'tuleva' as EPerusteStatus;
    }
  }
};

const getStatusColors = ({
  status,
  theme,
}: {
  status: EPerusteStatus;
  theme: Theme;
}) => {
  switch (status) {
    case EPERUSTE_STATUS_TULEVA:
      return {
        backgroundColor: setLightness(0.9, theme.colors.success.main),
        color: theme.colors.success.main,
      };
    case EPERUSTE_STATUS_VOIMASSA:
      return {
        backgroundColor: setLightness(0.9, theme.colors.primary.main),
        color: theme.colors.primary.main,
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
