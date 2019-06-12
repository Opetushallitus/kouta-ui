import React from 'react';
import styled, { css } from 'styled-components';
import { Transition } from 'react-spring';
import { connect } from 'react-redux';
import get from 'lodash/get';

import Icon from '../Icon';
import { getThemeProp } from '../../theme';
import Typography from '../Typography';
import { isString, isFunction } from '../../utils';
import { removeToast } from '../../state/toaster';

const ToasterContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ToastContainer = styled.div`
  display: inline-flex;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.15);
  border-radius: ${getThemeProp('shape.borderRadius')};
  overflow: hidden;
  max-width: 450px;
`;

const CloseIcon = styled(Icon).attrs({ type: 'close' })`
  color: ${getThemeProp('palette.text.primary')};
  opacity: 0.8;
  transition: opacity 0.25s;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`;

const CloseContainer = styled.div`
  flex: 0;
  margin-left: ${({ theme }) => theme.spacing.unit * 2}px;
`;

const ToastStatus = styled.div`
  flex: 0;
  color: white;
  padding: ${({ theme }) => theme.spacing.unit * 2}px;

  ${({ status }) =>
    status === 'success' &&
    css`
      background-color: ${getThemeProp('palette.success.main')};
    `}

  ${({ status }) =>
    status === 'danger' &&
    css`
      background-color: ${getThemeProp('palette.danger.main')};
    `}
`;

const ToastIcon = styled(Icon)`
  font-size: 2rem;
`;

const ToastContent = styled.div`
  padding: ${({ theme }) => theme.spacing.unit * 2}px;
  flex: 1;
  display: flex;
  background-color: white;
`;

const StatusTitle = styled(Typography).attrs({ variant: 'h6' })`
  ${({ status }) =>
    status === 'success' &&
    css`
      color: ${getThemeProp('palette.success.main')};
    `}

  ${({ status }) =>
    status === 'danger' &&
    css`
      color: ${getThemeProp('palette.danger.main')};
    `}
`;

const iconByStatus = {
  success: 'check_circle_outline',
  danger: 'error_outline',
};

export const Toast = ({
  status = 'success',
  title = null,
  children = null,
  onClose,
  ...props
}) => (
  <ToastContainer {...props}>
    <ToastStatus status={status}>
      <ToastIcon type={iconByStatus[status] || ''} />
    </ToastStatus>
    <ToastContent status={status}>
      <div>
        {title ? (
          <StatusTitle status={status} marginBottom={children ? 1 : 0}>
            {title}
          </StatusTitle>
        ) : null}
        {isString(children) ? <Typography>{children}</Typography> : children}
      </div>
      {isFunction(onClose) ? (
        <CloseContainer>
          <CloseIcon onClick={onClose} />
        </CloseContainer>
      ) : null}
    </ToastContent>
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

export const Toaster = ({ toasts, onClose, ...props }) => (
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
            status={item.status}
            title={item.title}
            style={props}
            {...(isFunction(onClose)
              ? {
                  onClose: () => {
                    onClose(item.key);
                  },
                }
              : {})}
          >
            {item.description}
          </Toast>
        </ToastWrapper>
      )}
    </Transition>
  </ToasterContainer>
);

export const ReduxToaster = connect(
  state => ({
    toasts: get(state, 'toaster.toasts') || [],
  }),
  dispatch => ({
    onClose: key => {
      dispatch(removeToast(key));
    },
  }),
)(Toaster);

export default Toaster;
