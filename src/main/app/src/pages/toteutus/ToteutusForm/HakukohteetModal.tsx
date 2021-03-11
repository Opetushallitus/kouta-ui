import React from 'react';

import { useTranslation } from 'react-i18next';

import { EntityModal } from '#/src/components/EntityModal';
import useEntityOptions from '#/src/hooks/useEntityOptionsHook';
import { useHaut } from '#/src/utils/haku/getHaut';

const HakukohteetModal = ({
  open,
  onClose,
  organisaatioOid,
  onSave: onSaveProp,
}) => {
  const { t } = useTranslation();

  const { data: haut } = useHaut({
    organisaatioOid,
  });

  const options = useEntityOptions(haut);

  return (
    <EntityModal
      labelText={t('yleiset.valitseHaku')}
      headerText={t('toteutuslomake.hakukohteenLiittaminen')}
      submitText={t('yleiset.lisaaHakukohde')}
      options={options}
      onSubmit={({ oid }) => onSaveProp({ hakuOid: oid })}
      onClose={onClose}
      open={open}
    />
  );
};

export default HakukohteetModal;
