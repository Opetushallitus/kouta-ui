import styled, { css } from 'styled-components';

import { getThemeProp } from '../../theme';
import Typography from '../Typography';
import { space } from '../../system';

export const FormHelperText = styled(Typography).attrs({
  marginTop: 1,
  as: 'div',
})`
  ${getThemeProp('typography.secondary')};
  ${space}

  ${({ error }) =>
    error &&
    css`
      color: ${getThemeProp('palette.danger.main')};
    `};
`;

export default FormHelperText;
