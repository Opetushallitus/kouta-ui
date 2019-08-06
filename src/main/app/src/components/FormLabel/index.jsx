import styled, { css } from 'styled-components';

import { getThemeProp } from '../../theme';
import { space } from '../../system';

export const FormLabel = styled.label.attrs({ marginBottom: 1 })`
  ${getThemeProp('typography.body')};
  ${space}
  display: inline-block;
  color: ${getThemeProp('palette.text.dark')};

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
    `}
`;

export default FormLabel;
