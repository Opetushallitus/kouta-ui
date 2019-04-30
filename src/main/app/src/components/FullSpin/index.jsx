import React from 'react';
import styled from 'styled-components';

import Spin from '../Spin';

const SpinContainer = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const FullSpin = props => (
  <SpinContainer>
    <Spin {...props} />
  </SpinContainer>
);

export default FullSpin;
