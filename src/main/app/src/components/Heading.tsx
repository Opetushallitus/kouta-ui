import React from 'react';

import styled from 'styled-components';

import { Box, Divider, Typography } from '#/src/components/virkailija';

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
  <Box width={hasDivider ? '100%' : 'auto'}>
    <StyledTypography variant={variant} {...props}>
      {children}
    </StyledTypography>
    {hasDivider && <Divider mb={2} />}
  </Box>
);

export default Heading;
