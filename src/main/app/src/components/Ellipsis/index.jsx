import { ellipsis } from 'polished';
import styled from 'styled-components';

export const Ellipsis = styled.div`
  ${({ width }) => width && ellipsis(width)};
`;

export default Ellipsis;
