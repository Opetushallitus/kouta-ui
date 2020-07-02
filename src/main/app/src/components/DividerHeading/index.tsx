import React from 'react';
import Heading from '#/src/components/Heading';

export const DividerHeading = ({
  children = undefined,
  variant = 'h6',
  ...spacing
}) => {
  return (
    <Heading variant={variant} hasDivider={true} {...spacing}>
      {children}
    </Heading>
  );
};

export default DividerHeading;
