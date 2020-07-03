import React from 'react';

import Spin from '#/src/components/Spin';
import Box from '#/src/components/Box';

const ListSpin = props => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="300px"
  >
    <Spin {...props} />
  </Box>
);

export default ListSpin;
