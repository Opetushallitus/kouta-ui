import React, { useMemo } from 'react';

import BaseFields from '../BaseFields';
import FormControl from '../FormControl';
import FormLabel from '../FormLabel';
import { getKoutaKoulutukset } from '../../apiUtils';
import { getFirstLanguageValue } from '../../utils';
import useTranslation from '../useTranslation';
import useApiAsync from '../useApiAsync';

const getKoulutusOptions = koulutukset => {
  return koulutukset.map(({ nimi, oid }) => ({
    value: oid,
    label: getFirstLanguageValue(nimi),
  }));
};

const BaseSelectionSection = ({ organisaatioOid }) => {
  const { t } = useTranslation();

  const { data = [] } = useApiAsync({
    promiseFn: getKoutaKoulutukset,
    organisaatioOid,
    watch: organisaatioOid,
  });

  const options = useMemo(() => getKoulutusOptions(data), [data]);

  return (
    <FormControl>
      <FormLabel>{t('yleiset.valitseLomakkeenPohja')}</FormLabel>
      <BaseFields
        name="pohja"
        createLabel={t('koulutuslomake.luoUusiKoulutus')}
        copyLabel={t('koulutuslomake.kopioiPohjaksiKoulutus')}
        copyOptions={options}
      />
    </FormControl>
  );
};

export default BaseSelectionSection;
