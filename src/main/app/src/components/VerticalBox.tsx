import React from 'react';

import { Box } from '#/src/components/virkailija';

export const VerticalBox = ({ children, gap }) =>
  React.Children.map(children, (child, index) => (
    <Box mb={index === React.Children.count(children) - 1 ? 0 : gap}>
      {child}
    </Box>
  ));
