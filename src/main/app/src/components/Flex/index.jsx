import styled from 'styled-components';
import SFlex, { FlexItem as SFlexItem } from 'styled-flex-component';

import { space } from '../../system';

const Flex = styled(SFlex)`
  ${space};
`;

export const FlexItem = styled(SFlexItem)`
  ${space};
  box-sizing: border-box;
`;

export default Flex;
