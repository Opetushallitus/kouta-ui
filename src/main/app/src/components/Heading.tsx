import React from 'react';
import styled from 'styled-components';
import { Divider, Typography } from '#/src/components/virkailija';

const StyledTypography = styled(Typography)`
  width: 100%;
`;

export const Heading = ({
  children = null,
  variant = 'h6',
  hasDivider = false,
  ...props
}) => (
  <StyledTypography variant={variant} marginBottom={2} {...props}>
    {children}
    {hasDivider && <Divider />}
  </StyledTypography>
);

export default Heading;
