import styled from 'styled-components';

import { getThemeProp, spacingCss } from '../../theme';

export const Label = styled.label.attrs({ marginBottom: 1 })`
  ${getThemeProp('typography.body')};
  ${spacingCss}

  font-weight: bold;
  display: block;
`;

export default Label;
