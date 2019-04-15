import styled, { css } from 'styled-components';

import { spacingCss, getThemeProp } from '../../theme';
import Typography from '../Typography';

export const FormHelperText = styled(Typography).attrs({
  marginTop: 1,
  as: 'div',
})`
  ${getThemeProp('typography.secondary')};
  ${spacingCss}

  ${({ error }) =>
    error &&
    css`
      color: ${getThemeProp('palette.danger.main')};
    `};
`;

export default FormHelperText;
