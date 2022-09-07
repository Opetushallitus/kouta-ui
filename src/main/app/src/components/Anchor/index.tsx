import React from 'react';

import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { getThemeProp } from '#/src/theme';

const Anchor = styled.a`
  font-family: ${getThemeProp('typography.fontFamily')};
  color: ${getThemeProp('palette.primary.main')};
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }

  &:visited {
    color: ${({ theme }) => theme.colors.visitedLink};
  }
`;

export const RouterAnchor = props =>
  props?.to ? <Anchor {...props} as={Link} /> : <>{props.children}</>;

export default Anchor;
