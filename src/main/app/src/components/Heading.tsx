import React from 'react';

import styled from 'styled-components';

import { Box, Divider, Typography } from '#/src/components/virkailija';

const StyledTypography = styled(Typography)`
  width: 100%;
`;

type HeadingProps = {
  id?: string;
  children?: React.ReactNode;
  variant?: string;
  hasDivider?: boolean;
  mt?: number;
  mb?: number;
};

export const Heading = ({
  id,
  children,
  variant = 'h6',
  hasDivider = false,
  mt = 0,
  mb = 2,
}: HeadingProps) => (
  <Box width="100%" mb={mb} mt={mt}>
    <StyledTypography id={id} variant={variant}>
      {children}
    </StyledTypography>
    {hasDivider && <Divider />}
  </Box>
);

export default Heading;
