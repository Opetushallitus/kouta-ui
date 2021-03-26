import React from 'react';

import styled, { css } from 'styled-components';

import { media } from '#/src/theme';

const getWidth = prop => css`
  flex-basis: ${props => (props[prop] / 12) * 100}%;
  max-width: ${props => (props[prop] / 12) * 100}%;
`;

const GridColumnBase = styled.div`
  padding: ${({ theme, gutter }) => (theme.spacing.unit * gutter) / 2}px;
  box-sizing: border-box;
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: auto;

  ${media.lessThan('small')`
    ${props => props.sm && getWidth('xs')}
  `}

  ${media.greaterThan('small')`
    ${props => props.sm && getWidth('sm')}
  `}

  ${media.greaterThan('medium')`
    ${props => props.md && getWidth('md')}
  `}

  ${media.greaterThan('large')`
    ${props => props.lg && getWidth('lg')}
  `}
`;

export const GridColumn = ({ gutter = 0, xs = 12, sm, md, lg, ...props }) => {
  return (
    <GridColumnBase
      gutter={gutter}
      xs={xs}
      sm={sm}
      md={md}
      lg={lg}
      {...props}
    />
  );
};

export default GridColumn;
