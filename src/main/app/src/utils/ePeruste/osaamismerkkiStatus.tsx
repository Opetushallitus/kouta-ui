import { setLightness } from 'polished';
import { css } from 'styled-components';

import { OSAAMISMERKKI_JULKAISUTILA } from '#/src/constants';
import { Theme } from '#/src/theme';

const getStatusColors = ({
  status,
  theme,
}: {
  status: string;
  theme: Theme;
}) => {
  switch (status) {
    case OSAAMISMERKKI_JULKAISUTILA.JULKAISTU:
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

export const getOsaamismerkkiStatusCss = ({
  status,
  theme,
}: {
  status: string;
  theme: Theme;
}) => {
  const { backgroundColor, color } = getStatusColors({ status, theme });
  return css`
    background-color: ${backgroundColor};
    color: ${color};
  `;
};
