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
import getHaut from '#/src/utils/haku/getHaut';
import getToteutukset from '#/src/utils/toteutus/getToteutukset';

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
    vainHakukohteeseenLiitettavat: true,
  });

  const hakuOptions = useEntityOptions(haut);
  const toteutusOptions = useEntityOptions(toteutukset);

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
            menuPortalTarget={document.documentElement}
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
          menuPortalTarget={document.documentElement}
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
            {t('yleiset.luoUusiHakukohde')}
          </Button>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

export default LiitoksetModal;
