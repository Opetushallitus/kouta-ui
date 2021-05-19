import React from 'react';

import styled from 'styled-components';

import { Divider, Typography } from '#/src/components/virkailija';

const StyledTypography = styled(Typography)`
  width: 100%;
`;

type HeadingProps = {
  children?: React.ReactNode;
  variant?: string;
  hasDivider?: boolean;
};

export const Heading = ({
  children,
  variant = 'h6',
  hasDivider = false,
  ...props
}: HeadingProps) => (
  <StyledTypography variant={variant} marginBottom={2} {...props}>
    {children}
    {hasDivider && <Divider />}
  </StyledTypography>
);

export default Heading;
