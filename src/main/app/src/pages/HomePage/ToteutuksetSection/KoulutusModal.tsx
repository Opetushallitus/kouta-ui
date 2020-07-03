import React, { useState, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { isArray, sortBy } from 'lodash';
import Button from '#/src/components/Button';
import Modal from '#/src/components/Modal';
import ModalHeader from '#/src/components/ModalHeader';
import ModalBody from '#/src/components/ModalBody';
import ModalFooter from '#/src/components/ModalFooter';
import Select from '#/src/components/Select';
import { useTranslation } from 'react-i18next';
import useApiAsync from '#/src/hooks/useApiAsync';
import getKoulutukset from '#/src/utils/koulutus/getKoulutukset';
import FormLabel from '#/src/components/FormLabel';
import Box from '#/src/components/Box';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import useLanguage from '#/src/hooks/useLanguage';

const KoulutusModal = ({ onClose, organisaatioOid, open }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const language = useLanguage();
  const [koulutus, setKoulutus] = useState();

  const { data } = useApiAsync({
    promiseFn: getKoulutukset,
    organisaatioOid,
    watch: organisaatioOid,
  });

  const options = useMemo(
    () =>
      isArray(data)
        ? sortBy(
            data.map(({ nimi, oid }) => ({
              value: oid,
              label: getFirstLanguageValue(nimi, language),
            })),
            ({ label }) => label
          )
        : [],
    [data, language]
  );

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
            {t('etusivu.luoUusiToteutus')}
          </Button>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

export default KoulutusModal;
