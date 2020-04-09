import React from 'react';

import BaseFields from '../BaseFields';
import FormControl from '../FormControl';
import FormLabel from '../FormLabel';
import { useTranslation } from 'react-i18next';

const PohjaSection = ({ organisaatioOid, name }) => {
  const { t } = useTranslation();

  const options = [];

  return (
    <FormControl>
      <FormLabel>{t('yleiset.valitseLomakkeenPohja')}</FormLabel>
      <BaseFields
        name={name}
        createLabel={t('valintaperustelomake.luoUusiValintaperuste')}
        copyLabel={t('valintaperustelomake.kopioiPohjaksiValintaperuste')}
        copyOptions={options}
      />
    </FormControl>
  );
};

export default PohjaSection;
