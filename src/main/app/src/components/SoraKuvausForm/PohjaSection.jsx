import React from 'react';

import BaseFields from '../BaseFields';
import { useTranslation } from 'react-i18next';
import FormLabel from '../FormLabel';
import useSoraKuvausOptions from '../useSoraKuvausOptions';

export const PohjaSection = ({ name, organisaatioOid }) => {
  const { t } = useTranslation();
  const { options: copyOptions } = useSoraKuvausOptions({ organisaatioOid });

  return (
    <>
      <FormLabel>{t('yleiset.valitseLomakkeenPohja')}</FormLabel>
      <BaseFields
        name={name}
        createLabel={t('yleiset.luoUusi')}
        copyLabel={t('yleiset.kopioiTiedot')}
        copyOptions={copyOptions}
      />
    </>
  );
};

export default PohjaSection;
