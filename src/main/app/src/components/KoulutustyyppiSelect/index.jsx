import React from 'react';

import { KOULUTUSTYYPPI_CATEGORY } from '../../constants';
import Radio, { RadioGroup } from '../Radio';
import useTranslation from '../useTranslation';

export const KoulutustyyppiSelect = ({ johtaaTutkintoon = true, ...props }) => {
  const { t } = useTranslation();

  return (
    <RadioGroup {...props}>
      <Radio value={KOULUTUSTYYPPI_CATEGORY.AMMATILLINEN_KOULUTUS}>
        {t('yleiset.ammatillinenKoulutus')}
      </Radio>
      <Radio value={KOULUTUSTYYPPI_CATEGORY.YLIOPISTOKOULUTUS}>
        {t('yleiset.yliopistokoulutus')}
      </Radio>
      <Radio value={KOULUTUSTYYPPI_CATEGORY.AMKKOULUTUS}>
        {t('yleiset.amkKoulutus')}
      </Radio>
    </RadioGroup>
  );
};

export default KoulutustyyppiSelect;
