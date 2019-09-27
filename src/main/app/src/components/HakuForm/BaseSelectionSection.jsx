import React, { useMemo } from 'react';

import BaseFields from '../BaseFields';
import FormControl from '../FormControl';
import FormLabel from '../FormLabel';
import getHaut from '../../utils/kouta/getHaut';
import { getFirstLanguageValue } from '../../utils';
import useTranslation from '../useTranslation';
import useApiAsync from '../useApiAsync';

const getHakuOptions = haut => {
  return haut.map(({ nimi, oid }) => ({
    value: oid,
    label: getFirstLanguageValue(nimi),
  }));
};

const BaseSelectionSection = ({ organisaatioOid, name }) => {
  const { t } = useTranslation();

  const { data = [] } = useApiAsync({
    promiseFn: getHaut,
    organisaatioOid,
    watch: organisaatioOid,
  });

  const options = useMemo(() => getHakuOptions(data), [data]);

  return (
    <FormControl>
      <FormLabel>{t('yleiset.valitseLomakkeenPohja')}</FormLabel>
      <BaseFields
        name={name}
        createLabel={t('hakulomake.luoUusiHaku')}
        copyLabel={t('hakulomake.kopioiPohjaksiHaku')}
        copyOptions={options}
      />
    </FormControl>
  );
};

export default BaseSelectionSection;
