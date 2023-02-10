import React from 'react';

import UiModal from '@opetushallitus/virkailija-ui-components/Modal';

import {
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '#/src/components/virkailija';

const Modal = ({
  footer,
  header,
  children,
  onClose,
  minHeight,
  open = false,
  ...props
}) => {
  const wrapBody = Boolean(footer || header); // For legacy modal

  return open ? (
    <UiModal open={open} onClose={onClose} {...props}>
      {header && <ModalHeader onClose={onClose}>{header}</ModalHeader>}
      {wrapBody ? (
        <ModalBody minHeight={minHeight} maxHeight="calc(90vh - 124px)">
          {children}
        </ModalBody>
      ) : (
        children
      )}
      {footer && <ModalFooter>{footer}</ModalFooter>}
    </UiModal>
  ) : null;
};

export default Modal;
