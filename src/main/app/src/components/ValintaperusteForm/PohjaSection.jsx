import React from 'react';

import BaseFields from '../BaseFields';
import FormControl from '../FormControl';
import FormLabel from '../FormLabel';
import useTranslation from '../useTranslation';

const PohjaSection = ({ organisaatioOid }) => {
  const { t } = useTranslation();

  const options = [];

  return (
    <FormControl>
      <FormLabel>{t('yleiset.valitseLomakkeenPohja')}</FormLabel>
      <BaseFields
        name="pohja"
        createLabel={t('valintaperustelomake.luoUusiValintaperuste')}
        copyLabel={t('valintaperustelomake.kopioiPohjaksiValintaperuste')}
        copyOptions={options}
      />
    </FormControl>
  );
};

export default PohjaSection;
