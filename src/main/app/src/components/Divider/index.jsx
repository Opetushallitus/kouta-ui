import styled from 'styled-components';

import { space } from '../../system';

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.palette.border};
  ${space};
`;

export default Divider;
