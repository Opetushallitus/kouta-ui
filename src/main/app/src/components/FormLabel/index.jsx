import styled, { css } from 'styled-components';

import { getThemeProp, spacingCss } from '../../theme';

export const FormLabel = styled.label.attrs({ marginBottom: 1 })`
  ${getThemeProp('typography.body')};
  ${spacingCss}
  display: block;

  ${({ disabled }) => disabled && css`
    opacity: 0.5;
  `}
`;

export default FormLabel;
