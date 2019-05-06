import { useState, useCallback } from 'react';

export const useModal = (defaultOpen = false) => {
  const [open, setOpen] = useState(defaultOpen);

  const onClose = useCallback(() => setOpen(false), [setOpen]);
  const onToggle = useCallback(() => setOpen(!open), [open, setOpen]);

  return {
    open,
    onClose,
    onToggle,
  };
};

export default useModal;
