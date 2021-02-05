import React from 'react';
import styled from 'styled-components';

import { Spin } from '#/src/components/virkailija';

const SpinContainer = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const FullSpin = props => (
  <SpinContainer>
    <Spin {...props} />
  </SpinContainer>
);

export default FullSpin;
