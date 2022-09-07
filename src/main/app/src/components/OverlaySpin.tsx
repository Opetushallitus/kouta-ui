import React from 'react';

import styled from 'styled-components';

import { Box, Spin, Typography } from '#/src/components/virkailija';

const Overlay = styled.div`
  flex-direction: column;
  position: fixed;
  display: flex;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: auto;
  height: 100%;
  z-index: 100;
  background-color: rgba(180, 180, 180, 0.8);
  backdrop-filter: blur(6px);
  justify-content: center;
  align-items: center;
`;

export const OverlaySpin = (props?: { text?: string }) => (
  <Overlay>
    <Box marginBottom={2}>
      <Spin center />
    </Box>
    {props?.text && <Typography>{props.text}</Typography>}
  </Overlay>
);
