import React, { useMemo } from 'react';

import BaseFields from '../BaseFields';
import FormControl from '../FormControl';
import FormLabel from '../FormLabel';
import { getKoutaHaut } from '../../apiUtils';
import { getFirstLanguageValue } from '../../utils';
import useTranslation from '../useTranslation';
import useApiAsync from '../useApiAsync';

const getHakuOptions = haut => {
  return haut.map(({ nimi, oid }) => ({
    value: oid,
    label: getFirstLanguageValue(nimi),
  }));
};

const BaseSelectionSection = ({ organisaatioOid }) => {
  const { t } = useTranslation();

  const { data = [] } = useApiAsync({
    promiseFn: getKoutaHaut,
    organisaatioOid,
    watch: organisaatioOid,
  });

  const options = useMemo(() => getHakuOptions(data), [data]);

  return (
    <FormControl>
      <FormLabel>{t('yleiset.valitseLomakkeenPohja')}</FormLabel>
      <BaseFields
        name="pohja"
        createLabel={t('hakulomake.luoUusiHaku')}
        copyLabel={t('hakulomake.kopioiPohjaksiHaku')}
        copyOptions={options}
      />
    </FormControl>
  );
};

export default BaseSelectionSection;
