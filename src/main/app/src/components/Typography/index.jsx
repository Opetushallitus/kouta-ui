import styled, { css } from 'styled-components';
import React from 'react';

import { isString } from '../../utils';
import { getThemeProp, spacingCss } from '../../theme';

const variantToComponent = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
};

const getVariantComponent = variant => {
  if (!isString(variant) || !variantToComponent[variant]) {
    return 'span';
  }

  return variantToComponent[variant];
};

const variantCss = css`
  ${({ theme, variant }) => {
    return theme.typography[variant] || {};
  }};
`;

const TypographyBase = styled.span`
  font-family: ${getThemeProp('typography.fontFamily')};
  color: ${getThemeProp('palette.text.primary')};
  line-height: ${getThemeProp('typography.lineHeight')};
  margin-bottom: 0px;
  margin-top: 0px;

  ${variantCss};
  ${spacingCss}
`;

const Typography = ({ variant = 'body', ...props }) => (
  <TypographyBase
    as={getVariantComponent(variant)}
    variant={variant}
    {...props}
  />
);

export default Typography;
