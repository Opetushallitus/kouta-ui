import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';

import Button from '#/src/components/Button';
import Modal from '#/src/components/Modal';
import Select from '#/src/components/Select';
import { Box, FormLabel } from '#/src/components/virkailija';
import useEntityOptions from '#/src/hooks/useEntityOptionsHook';
import { useHaut } from '#/src/utils/haku/getHaut';

const HakukohteetModal = ({
  onClose,
  organisaatioOid,
  onSave: onSaveProp,
  ...props
}) => {
  const { t } = useTranslation();
  const [selectedHakuOption, setSelectedHakuOption] = useState<
    SelectOption | undefined
  >();

  const { data: haut } = useHaut({
    organisaatioOid,
  });

  const onSave = useCallback(() => {
    return onSaveProp({ hakuOid: selectedHakuOption?.value });
  }, [onSaveProp, selectedHakuOption]);

  const hautOptions = useEntityOptions(haut);

  return (
    <Modal
      minHeight="200px"
      header={t('toteutuslomake.hakukohteenLiittaminen')}
      footer={
        <Box display="flex" justifyContent="space-between">
          <Button onClick={onClose} variant="outlined" type="button">
            {t('yleiset.sulje')}
          </Button>
          <Button onClick={onSave} type="button" disabled={!selectedHakuOption}>
            {t('yleiset.lisaaHakukohde')}
          </Button>
        </Box>
      }
      onClose={onClose}
      {...props}
    >
      <Box>
        <FormLabel htmlFor="hakukohteenToteutus">
          {t('yleiset.valitseHaku')}
        </FormLabel>
        <Select
          options={hautOptions}
          menuPortalTarget={document.body}
          menuPosition="fixed"
          onChange={setSelectedHakuOption}
          value={selectedHakuOption}
        />
      </Box>
    </Modal>
  );
};

export default HakukohteetModal;
