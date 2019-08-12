import React, { useMemo } from 'react';

import BaseFields from '../BaseFields';
import FormControl from '../FormControl';
import FormLabel from '../FormLabel';
import { getKoutaToteutukset } from '../../apiUtils';
import { getFirstLanguageValue } from '../../utils';
import useTranslation from '../useTranslation';
import useApiAsync from '../useApiAsync';

const getToteutusOptions = toteutukset => {
  return toteutukset.map(({ nimi, oid }) => ({
    value: oid,
    label: getFirstLanguageValue(nimi),
  }));
};

const BaseSelectionSection = ({ organisaatioOid, name }) => {
  const { t } = useTranslation();

  const { data = [] } = useApiAsync({
    promiseFn: getKoutaToteutukset,
    organisaatioOid,
    watch: organisaatioOid,
  });

  const options = useMemo(() => getToteutusOptions(data), [data]);

  return (
    <FormControl>
      <FormLabel>{t('yleiset.valitseLomakkeenPohja')}</FormLabel>
      <BaseFields
        name={name}
        createLabel={t('yleiset.luoUusiToteutus')}
        copyLabel={t('yleiset.kopioiPohjaksiToteutus')}
        copyOptions={options}
      />
    </FormControl>
  );
};

export default BaseSelectionSection;
