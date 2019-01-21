import styled from 'styled-components';

import { spacingCss } from '../../theme';

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.palette.border};
  ${spacingCss};
`;

export default Divider;