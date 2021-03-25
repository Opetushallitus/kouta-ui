import React, { useState, useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import Button from '#/src/components/Button';
import Modal from '#/src/components/Modal';
import Select from '#/src/components/Select';
import {
  Box,
  FormLabel,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '#/src/components/virkailija';
import useApiAsync from '#/src/hooks/useApiAsync';
import useEntityOptions from '#/src/hooks/useEntityOptionsHook';
import getKoulutukset from '#/src/utils/koulutus/getKoulutukset';

const KoulutusModal = ({ onClose, organisaatioOid, open }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [koulutus, setKoulutus] = useState();

  const { data } = useApiAsync({
    promiseFn: getKoulutukset,
    organisaatioOid,
    watch: organisaatioOid,
  });

  const options = useEntityOptions(data);

  const onSubmit = useCallback(() => {
    if (koulutus) {
      history.push(
        `/organisaatio/${organisaatioOid}/koulutus/${koulutus.value}/toteutus`
      );
    }
  }, [history, koulutus, organisaatioOid]);

  return (
    <Modal open={open}>
      <ModalHeader onClose={onClose}>
        {t('etusivu.toteutuksenKoulutus')}
      </ModalHeader>
      <ModalBody>
        <FormLabel htmlFor="toteutuksenKoulutus">
          {t('etusivu.valitseToteutuksenKoulutus')}
        </FormLabel>
        <Select
          value={koulutus}
          onChange={setKoulutus}
          options={options}
          menuPosition="fixed"
          menuPortalTarget={document.body}
          id="toteutuksenKoulutus"
        />
      </ModalBody>
      <ModalFooter>
        <Box display="flex" justifyContent="flex-end">
          <Box mr={2}>
            <Button variant="text" onClick={onClose}>
              {t('yleiset.sulje')}
            </Button>
          </Box>

          <Button disabled={!koulutus} onClick={onSubmit}>
            {t('yleiset.luoUusiToteutus')}
          </Button>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

export default KoulutusModal;
