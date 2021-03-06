import React from 'react';

import _fp from 'lodash/fp';
import styled, { css } from 'styled-components';

const StyledKuvaus = styled.div`
  ${({ noChildMargin }) =>
    noChildMargin &&
    css`
      & * {
        margin: 0;
        line-height: inherit;
      }
    `}
  ${({ theme }) => ({
    ..._fp.flow(
      _fp.get('typography'),
      _fp.pick(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
      _fp.mapValues(headingStyle => ({
        ...headingStyle,
        marginBottom: 0,
        marginTop: '20px',
      }))
    )(theme),
    ..._fp.get('typography.body', theme),
    maxWidth: '750px',
  })}
`;

export default function StyledSectionHTML({ html, ...props }) {
  return (
    <StyledKuvaus
      {...props}
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}
