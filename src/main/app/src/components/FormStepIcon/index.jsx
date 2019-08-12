import React from 'react';
import styled, { css } from 'styled-components';

import Icon from '../Icon';
import { getThemeProp } from '../../theme';

const Container = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
`;

const IconContainer = styled.div`
  border-radius: 50%;
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid;
  background-color: white;
  border-color: #cecece;

  ${({ active }) =>
    active &&
    css`
      background-color: ${getThemeProp('palette.primary.main')};
      border-color: white;
    `}

  ${({ done }) =>
    done &&
    css`
      border-color: ${getThemeProp('palette.primary.main')};
    `}
`;

const LabelContainer = styled.div`
  margin-top: ${getThemeProp('spacing.unit')}px;
  text-align: center;
  font-family: ${getThemeProp('typography.fontFamily')};
  color: ${getThemeProp('palette.text.primary')};
  font-size: 0.8rem;
  white-space: nowrap;

  ${({ active }) =>
    active &&
    css`
      color: ${getThemeProp('palette.primary.main')};
    `}
`;

const IconBase = styled(Icon)`
  font-size: 2rem;
  color: ${getThemeProp('palette.text.primary')};

  ${({ active }) =>
    active &&
    css`
      color: white;
    `}
`;

const FormStepIcon = ({
  children = null,
  icon = null,
  active = false,
  done = false,
  ...props
}) => (
  <Container {...props}>
    <IconContainer active={active} done={done}>
      <IconBase active={active} type={icon} />
    </IconContainer>
    <LabelContainer active={active}>{children}</LabelContainer>
  </Container>
);

export default FormStepIcon;
