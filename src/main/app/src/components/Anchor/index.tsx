import styled from 'styled-components';

import { getThemeProp } from '#/src/theme';

const Anchor = styled.a`
  font-family: ${getThemeProp('typography.fontFamily')};
  color: ${getThemeProp('palette.primary.main')};
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }
`;

export default Anchor;
