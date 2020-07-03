import React from 'react';

import UiModal from '@opetushallitus/virkailija-ui-components/Modal';
import ModalHeader from '@opetushallitus/virkailija-ui-components/ModalHeader';
import ModalBody from '@opetushallitus/virkailija-ui-components/ModalBody';
import ModalFooter from '@opetushallitus/virkailija-ui-components/ModalFooter';

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
