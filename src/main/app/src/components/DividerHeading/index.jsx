import React from 'react';
import styled from 'styled-components';

import { getThemeProp } from '../../theme';
import Typography from '../Typography';
import Spacing from '../Spacing';

const Container = styled(Spacing)`
  border-bottom: 1px solid ${getThemeProp('palette.divider')};
`;

export const DividerHeading = ({
  children = null,
  variant = 'h6',
  ...spacing
}) => {
  return (
    <Container marginBottom={2} {...spacing}>
      <Typography variant={variant} marginBottom={1}>
        {children}
      </Typography>
    </Container>
  );
};

export default DividerHeading;
