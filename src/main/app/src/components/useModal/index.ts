import { useState, useCallback } from 'react';

export const useModal = (defaultOpen = false) => {
  const [isOpen, setOpen] = useState(defaultOpen);

  const close = useCallback(() => setOpen(false), [setOpen]);
  const toggle = useCallback(() => setOpen(!isOpen), [isOpen, setOpen]);

  return {
    isOpen,
    open: setOpen,
    close,
    toggle,
  };
};

export default useModal;
