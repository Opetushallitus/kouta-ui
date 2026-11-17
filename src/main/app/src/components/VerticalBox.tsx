import React from 'react';

import { Box } from '#/src/components/virkailija';

export const VerticalBox = ({ children, gap }) =>
  // eslint-disable-next-line @eslint-react/no-children-map -- correctly handles all valid children shapes; a hand-rolled array conversion would be less correct, not more
  React.Children.map(children, (child, index) => (
    <Box
      mb={
        // eslint-disable-next-line @eslint-react/no-children-count -- see no-children-map above
        index === React.Children.count(children) - 1 ? 0 : gap
      }
    >
      {child}
    </Box>
  ));
