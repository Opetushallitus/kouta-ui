import React from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { Transition } from 'react-spring/renderprops';
import styled, { css } from 'styled-components';

import { AbstractCollapse } from '#/src/components/AbstractCollapse';
import { Box, Icon, Typography } from '#/src/components/virkailija';
import useToaster from '#/src/hooks/useToaster';
import { getThemeProp } from '#/src/theme';

const ToasterContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ToastContainer = styled.div`
  display: inline-flex;
  align-items: flex-start;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.15);
  border-radius: ${getThemeProp('shape.borderRadius')};
  overflow: hidden;
  max-width: 800px;
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
    
  ${({ status }) =>
    status === 'warning' &&
    css`
      background-color: ${getThemeProp('colors.mediumYellow.main')};
      color: black;
    `}
`;
const ToastWrapper = styled.div`
  display: flex;
  justify-content: flex-end;

  ${({ last }) =>
    !last &&
    css`
      margin-bottom: ${({ theme }) => theme.spacing.unit * 2}px;
    `};
`;

const hoverHighlightStyle = css`
  color: inherit;
  opacity: 0.7;
  font-size: 1.25rem;
  transition: opacity 0.25s;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`;

const CloseIcon = styled(Icon).attrs({ type: 'close' })(hoverHighlightStyle);

const ErrorContainer = styled.div`
  display: flex;
  ${hoverHighlightStyle}
`;

const ErrorToggle = ({ open, onToggle, ...props }) => {
  const { t } = useTranslation();
  return (
    <ErrorContainer onClick={onToggle} {...props}>
      <Icon type={open ? 'arrow_drop_down' : 'arrow_right'} />
      <Typography color="inherit">
        {open ? t('ilmoitukset.piilotaVirhe') : t('ilmoitukset.naytaVirhe')}
      </Typography>
    </ErrorContainer>
  );
};

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
    <Typography color="inherit">{children}</Typography>
    {_fp.isFunction(onClose) ? (
      <Box ml={2}>
        <CloseIcon onClick={onClose} />
      </Box>
    ) : null}
  </ToastContainer>
);

const FormattedError = styled.pre`
  font-size: 13px;
  white-space: pre-wrap;
  word-break: keep-all;
`;

export const Toaster = ({ ...props }) => {
  const { toasts, closeToast, toastMouseEnter, toastMouseLeave } = useToaster();

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
        {(item, state, index) => props =>
          (
            <ToastWrapper last={index === toasts.length - 1}>
              <Toast
                key={item.key}
                status={item.status}
                style={props}
                onClose={() => closeToast(item.key)}
                onMouseEnter={() => toastMouseEnter(item.key)}
                onMouseLeave={() => toastMouseLeave(item.key)}
              >
                <Box mb={1}>{item.label}</Box>
                {item.error && (
                  <AbstractCollapse
                    content={
                      <FormattedError>
                        {JSON.stringify(item.error, null, 2)}
                      </FormattedError>
                    }
                  >
                    {({ open, onToggle }) => (
                      <ErrorToggle open={open} onToggle={onToggle} />
                    )}
                  </AbstractCollapse>
                )}
              </Toast>
            </ToastWrapper>
          )}
      </Transition>
    </ToasterContainer>
  );
};

export default Toaster;
