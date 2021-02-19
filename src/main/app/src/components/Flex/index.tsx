import styled from 'styled-components';
import SFlex, { FlexItem as SFlexItem } from 'styled-flex-component';

import { space } from '#/src/system';

const shouldForwardProp = prop =>
  ['children'].includes(prop) || prop.startsWith('data-');

export const Flex = styled(SFlex).withConfig({
  shouldForwardProp,
})`
  ${space};
`;

export const FlexItem = styled(SFlexItem).withConfig({
  shouldForwardProp,
})`
  ${space};
  box-sizing: border-box;
`;
