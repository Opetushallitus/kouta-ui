import React, { useMemo } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import { RouterAnchor } from '#/src/components/Anchor';
import Button from '#/src/components/Button';
import Modal from '#/src/components/Modal';
import { Box, Typography } from '#/src/components/virkailija';
import { useFormSaveRemoteErrors } from '#/src/hooks/useFormSaveRemoteErrors';
import { useSelectedOrganisaatioOid } from '#/src/hooks/useSelectedOrganisaatio';

export const KoulutusSaveErrorModal = () => {
  const { t } = useTranslation();

  const { remoteErrors = [], setRemoteErrors } = useFormSaveRemoteErrors();
  const errorsWithToteutukset = useMemo(
    () => remoteErrors?.filter?.(e => !_fp.isEmpty(e?.meta?.toteutukset)),
    [remoteErrors]
  );

  const isOpen = !_fp.isEmpty(errorsWithToteutukset);

  const closeModal = () => setRemoteErrors(null);

  const organisaatioOid = useSelectedOrganisaatioOid();

  return (
    <Modal
      minHeight="90vh"
      maxWidth="1200px"
      open={isOpen}
      onClose={closeModal}
      header={t('koulutuslomake.epayhteensopiviaToteutuksia')}
      footer={
        <Box display="flex" justifyContent="flex-end">
          <Button variant="outlined" onClick={closeModal}>
            {t('yleiset.sulje')}
          </Button>
        </Box>
      }
    >
      <Box flexDirection="column">
        {errorsWithToteutukset.map(error => (
          <div key={error.errorType}>
            <Typography>
              {t(`validointivirheet.${error.errorType}`)}:
            </Typography>
            {error.meta.toteutukset.map(oid => (
              <Typography my={1} as="p" key={oid}>
                <RouterAnchor
                  to={`/organisaatio/${organisaatioOid}/toteutus/${oid}/muokkaus`}
                >
                  {oid}
                </RouterAnchor>
              </Typography>
            ))}
          </div>
        ))}
      </Box>
    </Modal>
  );
};
