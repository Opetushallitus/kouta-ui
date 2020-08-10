import React from 'react';
import { Divider, Typography } from '#/src/components/virkailija';

export const Heading = ({
  children = null,
  variant = 'h6',
  hasDivider,
  ...props
}) => (
  <Typography variant={variant} marginBottom={2} {...props}>
    {children}
    {hasDivider && <Divider />}
  </Typography>
);

export default Heading;
