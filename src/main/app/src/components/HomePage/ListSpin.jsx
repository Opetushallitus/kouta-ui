import React from 'react';

import Spin from '../Spin';
import Box from '../Box';

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
