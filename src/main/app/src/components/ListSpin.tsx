import React from 'react';

import { Box, Spin } from '#/src/components/virkailija';

const ListSpin = props => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="300px"
  >
    <Spin center {...props} />
  </Box>
);

export default ListSpin;
