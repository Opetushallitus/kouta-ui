import React, { useMemo } from 'react';

import BaseFields from '../BaseFields';
import FormControl from '../FormControl';
import FormLabel from '../FormLabel';
import getKoulutukset from '../../utils/kouta/getKoulutukset';
import { getFirstLanguageValue } from '../../utils';
import useTranslation from '../useTranslation';
import useApiAsync from '../useApiAsync';
import Typography from '../Typography';

const getKoulutusOptions = koulutukset => {
  return koulutukset.map(({ nimi, oid }) => ({
    value: oid,
    label: getFirstLanguageValue(nimi),
  }));
};

const BaseSelectionSection = ({ disabled, organisaatioOid, name }) => {
  const { t } = useTranslation();

  const { data = [] } = useApiAsync({
    promiseFn: getKoulutukset,
    organisaatioOid,
    watch: organisaatioOid,
  });

  const options = useMemo(() => getKoulutusOptions(data), [data]);

  return (
    <>
      <Typography variant="secondary" as="div" marginBottom={2}>
        {t('koulutuslomake.pohjavalintaInfo')}
      </Typography>
      <FormControl>
        <FormLabel>{t('yleiset.valitseLomakkeenPohja')}</FormLabel>
        <BaseFields
          disabled={disabled}
          name={name}
          createLabel={t('koulutuslomake.luoUusiKoulutus')}
          copyLabel={t('koulutuslomake.kopioiPohjaksiKoulutus')}
          copyOptions={options}
        />
      </FormControl>
    </>
  );
};

export default BaseSelectionSection;
