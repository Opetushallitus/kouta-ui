import React, { useState, useCallback } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import Modal from '#/src/components/Modal';
import Select from '#/src/components/Select';
import { Box, Button, FormLabel } from '#/src/components/virkailija';
import { SelectValue } from '#/src/types/formTypes';

type EntityModalProps = {
  headerText: string;
  labelText?: string;
  submitText: string;
  options?: Array<any>;
  onSubmit?: ({ oid: string }) => void;
  onClose?: () => void;
  open: boolean;
};

export const EntityModal = ({
  headerText,
  labelText,
  submitText,
  onClose = _.noop,
  onSubmit: onSubmitProp = _.noop,
  open = false,
  options = [],
}: EntityModalProps) => {
  const { t } = useTranslation();

  const [selectedEntityOption, setSelectedEntityOption] =
    useState<SelectValue>();

  const onSubmit = useCallback(() => {
    onSubmitProp({ oid: selectedEntityOption?.value });
  }, [selectedEntityOption, onSubmitProp]);

  return (
    <Modal
      minHeight="200px"
      open={open}
      onClose={onClose}
      header={headerText}
      footer={
        <Box display="flex" justifyContent="flex-end">
          <Box mr={2}>
            <Button variant="outlined" onClick={onClose}>
              {t('yleiset.sulje')}
            </Button>
          </Box>
          <Button disabled={!selectedEntityOption} onClick={onSubmit}>
            {submitText}
          </Button>
        </Box>
      }
    >
      <Box>
        {labelText && <FormLabel htmlFor="entitySelect">{labelText}</FormLabel>}
        <Select
          value={selectedEntityOption}
          onChange={setSelectedEntityOption}
          options={options}
          menuPosition="fixed"
          menuPortalTarget={document.body}
          id="entitySelect"
        />
      </Box>
    </Modal>
  );
};
