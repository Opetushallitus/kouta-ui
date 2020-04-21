import React from 'react';
import _fp from 'lodash/fp';
import styled from 'styled-components';

const StyledKuvaus = styled.div(({ theme }) => ({
  ..._fp.compose(
    _fp.mapValues(headingStyle => ({
      ...headingStyle,
      marginBottom: 0,
      marginTop: '20px',
    })),
    _fp.pick(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
    _fp.get('typography'),
  )(theme),
  ..._fp.get('typography.body', theme),
  maxWidth: '750px',
}));

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
