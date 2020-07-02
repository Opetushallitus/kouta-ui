import React from 'react';
import Typography from '@opetushallitus/virkailija-ui-components/Typography';
import Divider from '@opetushallitus/virkailija-ui-components/Divider';

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
