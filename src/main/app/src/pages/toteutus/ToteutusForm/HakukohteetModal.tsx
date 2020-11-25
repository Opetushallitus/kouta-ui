import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '#/src/components/Modal';
import Button from '#/src/components/Button';
import getHaut from '#/src/utils/haku/getHaut';
import useApiAsync from '#/src/hooks/useApiAsync';
import useEntityOptions from '#/src/hooks/useEntityOptionsHook';
import Select from '#/src/components/Select';
import { Box, FormLabel } from '#/src/components/virkailija';

const HakukohteetModal = ({
  onClose,
  organisaatioOid,
  onSave: onSaveProp,
  ...props
}) => {
  const { t } = useTranslation();
  const [selectedHaku, setHaku] = useState();

  const { data: haut } = useApiAsync({
    promiseFn: getHaut,
    organisaatioOid,
    watch: organisaatioOid,
  });

  const onSave = useCallback(() => {
    return onSaveProp({ hakuOid: selectedHaku });
  }, [onSaveProp, selectedHaku]);

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
          <Button onClick={onSave} type="button" disabled={!selectedHaku}>
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
          onChange={data => {
            setHaku(data?.value);
          }}
          value={selectedHaku}
        />
      </Box>
    </Modal>
  );
};

export default HakukohteetModal;
