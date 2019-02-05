import React from 'react';
import styled from 'styled-components';
import get from 'lodash/get';

import Flex from '../Flex';
import { spacing } from '../../theme';
import Typography from '../Typography';

const Badge = styled.div`
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 3px;
  background-color: ${({ theme, color }) => get(theme, ['palette', color, 'main']) || theme.primary.main};
  margin-right: ${spacing(1)};
`;

const TilaLabel = ({ children, color = 'primary', ...props }) => (
  <Flex inline alignCenter>
    <Badge color={color} />
    <Typography>
      {children}
    </Typography>
  </Flex>
);

export default TilaLabel;
