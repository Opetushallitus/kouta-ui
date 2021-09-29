import React from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { EntityModal } from '#/src/components/EntityModal';
import useEntityOptions from '#/src/hooks/useEntityOptionsHook';
import { useToteutukset } from '#/src/utils/toteutus/getToteutukset';

const HakukohteetModal = ({
  open,
  onClose,
  organisaatioOid,
  onSave: onSaveProp = _.noop,
}) => {
  const { t } = useTranslation();

  const { data: toteutukset } = useToteutukset({
    organisaatioOid,
    vainHakukohteeseenLiitettavat: true,
  });

  const options = useEntityOptions(toteutukset);

  return (
    <EntityModal
      labelText={t('yleiset.valitseToteutus')}
      headerText={t('yleiset.liitaHakukohde')}
      submitText={t('yleiset.luoUusiHakukohde')}
      options={options}
      onSubmit={({ oid }) => onSaveProp({ toteutusOid: oid })}
      onClose={onClose}
      open={open}
    />
  );
};

export default HakukohteetModal;
