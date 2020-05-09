import React, { useState, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { isArray, sortBy } from 'lodash';
import Button from '../../Button';
import Modal from '../../Modal';
import ModalHeader from '../../ModalHeader';
import ModalBody from '../../ModalBody';
import ModalFooter from '../../ModalFooter';
import Select from '../../Select';
import { useTranslation } from 'react-i18next';
import useApiAsync from '../../useApiAsync';
import getKoulutukset from '../../../utils/kouta/getKoulutukset';
import FormLabel from '../../FormLabel';
import Box from '../../Box';
import { getFirstLanguageValue } from '../../../utils';
import useLanguage from '../../useLanguage';

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
