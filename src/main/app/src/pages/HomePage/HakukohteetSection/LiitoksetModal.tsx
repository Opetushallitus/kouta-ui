import React, { useState, useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Modal from '#/src/components/Modal';
import Select from '#/src/components/Select';
import {
  Box,
  Button,
  FormLabel,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '#/src/components/virkailija';
import useEntityOptions from '#/src/hooks/useEntityOptionsHook';
import { useHaut } from '#/src/utils/haku/getHaut';
import { useToteutukset } from '#/src/utils/toteutus/getToteutukset';

const LiitoksetModal = ({ onClose, organisaatioOid, open }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [haku, setHaku] = useState();
  const [toteutus, setToteutus] = useState();

  const { data: haut } = useHaut({
    organisaatioOid,
  });

  const { data: toteutukset } = useToteutukset({
    organisaatioOid,
    vainHakukohteeseenLiitettavat: true,
  });

  const hakuOptions = useEntityOptions(haut);
  const toteutusOptions = useEntityOptions(toteutukset);

  const disabled = !haku || !toteutus;

  const onSubmit = useCallback(() => {
    if (!disabled) {
      navigate(
        `/organisaatio/${organisaatioOid}/toteutus/${toteutus.value}/haku/${haku.value}/hakukohde`
      );
    }
  }, [navigate, haku, toteutus, disabled, organisaatioOid]);

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
            menuPosition="fixed"
            menuPortalTarget={document.body}
            id="hakukohteenToteutus"
          />
        </Box>

        <Box>
          <FormLabel htmlFor="hakukohteenHaku">
            {t('etusivu.valitseHakukohteenHaku')}
          </FormLabel>
          <Select
            value={haku}
            onChange={setHaku}
            options={hakuOptions}
            menuPosition="fixed"
            menuPortalTarget={document.body}
            id="hakukohteenHaku"
          />
        </Box>
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
