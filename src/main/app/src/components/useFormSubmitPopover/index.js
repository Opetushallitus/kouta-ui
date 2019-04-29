import { useState, useCallback } from 'react';

export const useFormSubmitPopover = ({
  initialVisible = false,
  visibleOnSuccess = true,
  visibleOnError = true,
  onSave,
} = {}) => {
  const [popoverVisible, setPopoverVisible] = useState(initialVisible);
  const [submitStatus, setSubmitStatus] = useState();
  const [submitPayload, setSubmitPayload] = useState();

  const enhancedOnSave = useCallback(async () => {
    try {
      setPopoverVisible(false);

      const payload = await onSave();

      setSubmitPayload(payload);
      setSubmitStatus('success');
      visibleOnSuccess && setPopoverVisible(true);
    } catch (e) {
      setSubmitStatus('danger');
      visibleOnError && setPopoverVisible(true);
    }
  }, [onSave, visibleOnSuccess, visibleOnError]);

  const onClose = useCallback(() => {
    setPopoverVisible(false);
  }, [setPopoverVisible]);

  return {
    popoverProps: {
      visible: popoverVisible,
      payload: submitPayload,
      status: submitStatus,
      onClose,
      onOutsideClick: onClose,
    },
    enhancedOnSave,
  };
};

export default useFormSubmitPopover;
