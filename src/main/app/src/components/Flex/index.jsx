import styled from 'styled-components';
import SFlex, { FlexItem as SFlexItem } from 'styled-flex-component';

import { spacingCss } from '../../theme';

const Flex = styled(SFlex)`
  ${spacingCss};
`;

export const FlexItem = styled(SFlexItem)`
  ${spacingCss};
`;

export default Flex;