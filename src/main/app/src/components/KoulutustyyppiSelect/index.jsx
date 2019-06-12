import React, { useMemo } from 'react';

import { KOULUTUSTYYPPI } from '../../constants';
import { RadioGroup } from '../Radio';
import useTranslation from '../useTranslation';

const defaultKoulutustyypit = [
  KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
  KOULUTUSTYYPPI.YLIOPISTOKOULUTUS,
  KOULUTUSTYYPPI.AMKKOULUTUS,
  KOULUTUSTYYPPI.LUKIOKOULUTUS,
];

const getKoulutustyyppiToLabel = t => {
  return {
    [KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS]: t('yleiset.ammatillinenKoulutus'),
    [KOULUTUSTYYPPI.YLIOPISTOKOULUTUS]: t('yleiset.yliopistokoulutus'),
    [KOULUTUSTYYPPI.AMKKOULUTUS]: t('yleiset.amkKoulutus'),
    [KOULUTUSTYYPPI.LUKIOKOULUTUS]: t('yleiset.lukiokoulutus'),
  };
};

export const KoulutustyyppiSelect = ({
  johtaaTutkintoon = true,
  koulutustyypit = defaultKoulutustyypit,
  ...props
}) => {
  const { t } = useTranslation();
  const koulutustyyppiToLabel = useMemo(() => getKoulutustyyppiToLabel(t), [t]);

  const options = useMemo(
    () =>
      koulutustyypit.map(
        tyyppi => ({
          value: tyyppi,
          label: koulutustyyppiToLabel[tyyppi] || '',
        }),
        [koulutustyypit, koulutustyyppiToLabel],
      ),
    [koulutustyypit, koulutustyyppiToLabel],
  );

  return <RadioGroup options={options} {...props} />;
};

export default KoulutustyyppiSelect;
