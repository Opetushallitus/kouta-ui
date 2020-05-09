import React, { useState, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { isArray } from 'lodash';
import Button from '../../Button';
import Modal from '../../Modal';
import ModalHeader from '../../ModalHeader';
import ModalBody from '../../ModalBody';
import ModalFooter from '../../ModalFooter';
import Select from '../../Select';
import { useTranslation } from 'react-i18next';
import useApiAsync from '../../useApiAsync';
import getToteutukset from '../../../utils/kouta/getToteutukset';
import getHaut from '../../../utils/kouta/getHaut';
import FormLabel from '../../FormLabel';
import Box from '../../Box';
import { getFirstLanguageValue } from '../../../utils';
import useLanguage from '../../useLanguage';

const useOptions = data => {
  const language = useLanguage();

  return useMemo(
    () =>
      isArray(data)
        ? data.map(({ nimi, oid }) => ({
            value: oid,
            label: getFirstLanguageValue(nimi, language),
          }))
        : [],
    [data, language]
  );
};

const LiitoksetModal = ({ onClose, organisaatioOid, open }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [haku, setHaku] = useState();
  const [toteutus, setToteutus] = useState();

  const { data: haut } = useApiAsync({
    promiseFn: getHaut,
    organisaatioOid,
    watch: organisaatioOid,
  });

  const { data: toteutukset } = useApiAsync({
    promiseFn: getToteutukset,
    organisaatioOid,
    watch: organisaatioOid,
  });

  const hakuOptions = useOptions(haut);
  const toteutusOptions = useOptions(toteutukset);

  const disabled = !haku || !toteutus;

  const onSubmit = useCallback(() => {
    if (!disabled) {
      history.push(
        `/organisaatio/${organisaatioOid}/toteutus/${toteutus.value}/haku/${haku.value}/hakukohde`
      );
    }
  }, [history, haku, toteutus, disabled, organisaatioOid]);

  return (
    <Modal open={open}>
      <ModalHeader onClose={onClose}>
        {t('etusivu.hakukohteenToteutusJaHaku')}
      </ModalHeader>
      <ModalBody>
        <Box mb={2}>
          <FormLabel htmlFor="hakukohteenToteutus">
            {t('etusivu.valitseHakukohteenToteutus')}
          </FormLabel>
          <Select
            value={toteutus}
            onChange={setToteutus}
            options={toteutusOptions}
            menuPortalTarget={document.body}
            id="hakukohteenToteutus"
          />
        </Box>

        <FormLabel htmlFor="hakukohteenHaku">
          {t('etusivu.valitseHakukohteenHaku')}
        </FormLabel>
        <Select
          value={haku}
          onChange={setHaku}
          options={hakuOptions}
          menuPortalTarget={document.body}
          id="hakukohteenHaku"
        />
      </ModalBody>
      <ModalFooter>
        <Box display="flex" justifyContent="flex-end">
          <Box mr={2}>
            <Button variant="text" onClick={onClose}>
              {t('yleiset.sulje')}
            </Button>
          </Box>

          <Button disabled={disabled} onClick={onSubmit}>
            {t('etusivu.luoUusiHakukohde')}
          </Button>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

export default LiitoksetModal;
