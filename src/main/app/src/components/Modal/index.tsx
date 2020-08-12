import React from 'react';

import UiModal from '@opetushallitus/virkailija-ui-components/Modal';
import {
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '#/src/components/virkailija';

const Modal = ({ footer, header, children, onClose, minHeight, ...props }) => {
  const wrapBody = !!(footer || header); // For legacy modal

  return (
    <UiModal onClose={onClose} {...props}>
      {header && <ModalHeader onClose={onClose}>{header}</ModalHeader>}
      {wrapBody ? (
        <ModalBody minHeight={minHeight}>{children}</ModalBody>
      ) : (
        children
      )}
      {footer && <ModalFooter>{footer}</ModalFooter>}
    </UiModal>
  );
};

export default Modal;
