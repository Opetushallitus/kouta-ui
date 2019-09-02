import React from 'react';
import styled, { keyframes, css } from 'styled-components';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const baseSize = 35;
const baseBorderWidth = 4;

const sizeMultipliers = {
  small: 0.5,
  medium: 1,
  large: 1.5,
};

const CenterContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const SpinCircle = styled.div`
  width: 35px;
  height: 35px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.1);
  border-top-color: ${({ theme }) => theme.palette.primary.main};
  border-radius: 50%;
  animation: ${spin};
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  display: inline-flex;
  flex-grow: 0;

  ${({ size }) => css`
    width: ${(sizeMultipliers[size] || 1) * baseSize}px;
    height: ${(sizeMultipliers[size] || 1) * baseSize}px;
    border-width: ${(sizeMultipliers[size] || 1) * baseBorderWidth}px;
  `};
`;

export const Spin = ({
  size = 'medium',
  center = false,
  ariaLabel: ariaLabelProp,
  ...props
}) => {
  const spinProps = { size, ...props };

  const ariaLabel = ariaLabelProp || 'Ladataan sisältöä';

  return center ? (
    <CenterContainer>
      <SpinCircle {...spinProps} ariaLabel={ariaLabel} />
    </CenterContainer>
  ) : (
    <SpinCircle {...spinProps} />
  );
};

export default Spin;
