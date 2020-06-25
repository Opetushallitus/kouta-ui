import React from 'react';
import styled, { css } from 'styled-components';
import { Transition } from 'react-spring/renderprops';
import _ from 'lodash/fp';

import { getThemeProp } from '#/src/theme';
import Icon from '#/src/components/Icon';
import Typography from '#/src/components/Typography';
import Box from '#/src/components/Box';
import useToaster from '#/src/components/useToaster';

const ToasterContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ToastContainer = styled.div`
  display: inline-flex;
  align-items: center;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.15);
  border-radius: ${getThemeProp('shape.borderRadius')};
  overflow: hidden;
  max-width: 450px;
  background-color: white;
  color: ${({ theme }) => theme.palette.text.primary};
  padding: 16px;

  ${({ status }) =>
    status === 'success' &&
    css`
      background-color: ${getThemeProp('palette.success.main')};
      color: white;
    `}

  ${({ status }) =>
    status === 'danger' &&
    css`
      background-color: ${getThemeProp('palette.danger.main')};
      color: white;
    `}
  
  ${({ status }) =>
    status === 'info' &&
    css`
      background-color: ${getThemeProp('palette.primary.main')};
      color: white;
    `}
`;

const CloseIcon = styled(Icon).attrs({ type: 'close' })`
  color: inherit;
  opacity: 0.6;
  font-size: 1.25rem;
  transition: opacity 0.25s;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`;

const iconByStatus = {
  success: 'check_circle_outline',
  danger: 'error_outline',
  info: 'info',
};

export const Toast = ({
  status = 'info',
  children = null,
  onClose,
  ...props
}) => (
  <ToastContainer status={status} {...props}>
    <Icon type={iconByStatus[status] || ''} mr={2} />
    <Box>
      <Typography color="inherit">{children}</Typography>
    </Box>
    {_.isFunction(onClose) ? (
      <Box ml={2}>
        <CloseIcon onClick={onClose} />
      </Box>
    ) : null}
  </ToastContainer>
);

const ToastWrapper = styled.div`
  display: flex;
  justify-content: flex-end;

  ${({ last }) =>
    !last &&
    css`
      margin-bottom: ${({ theme }) => theme.spacing.unit * 2}px;
    `};
`;

export const Toaster = ({ ...props }) => {
  const { toasts, closeToast } = useToaster();

  return (
    <ToasterContainer {...props}>
      <Transition
        items={toasts}
        keys={item => item.key}
        enter={{
          opacity: 1,
          transform: 'scale(1)',
        }}
        leave={{
          opacity: 0,
          transform: 'scale(0.5)',
        }}
        from={{
          opacity: 0,
          transform: 'scale(0.5)',
        }}
      >
        {(item, state, index) => props => (
          <ToastWrapper last={index === toasts.length - 1}>
            <Toast
              key={item.key}
              status={item.status}
              style={props}
              onClose={() => closeToast(item.key)}
            >
              {item.label}
            </Toast>
          </ToastWrapper>
        )}
      </Transition>
    </ToasterContainer>
  );
};

export default Toaster;
