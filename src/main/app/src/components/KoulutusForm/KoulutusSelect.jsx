import React, { useMemo } from 'react';
import mapValues from 'lodash/mapValues';

import useApiAsync from '../useApiAsync';

import Select from '../Select';
import { getKoulutuksetByKoulutusTyyppi } from '../../apiUtils';

import {
  arrayToTranslationObject,
  isArray,
  getFirstLanguageValue,
} from '../../utils';

const getKoulutukset = async ({ koulutustyyppi, httpClient, apiUrls }) => {
  const koulutukset = await getKoulutuksetByKoulutusTyyppi({
    koulutusTyyppi: koulutustyyppi,
    httpClient,
    apiUrls,
  });

  return isArray(koulutukset)
    ? koulutukset.map(({ metadata, koodiUri, versio }) => ({
        nimi: mapValues(arrayToTranslationObject(metadata), ({ nimi }) => nimi),
        koodiUri: `${koodiUri}#${versio}`,
      }))
    : [];
};

const getOptions = koulutukset => {
  return koulutukset.map(({ nimi, koodiUri }) => ({
    value: koodiUri,
    label: getFirstLanguageValue(nimi),
  }));
};

const KoulutusSelect = ({
  koulutustyyppi = 'amm',
  language = 'fi',
  value,
  ...props
}) => {
  const { data } = useApiAsync({
    promiseFn: getKoulutukset,
    koulutustyyppi,
    watch: koulutustyyppi,
  });

  const options = useMemo(() => {
    return data ? getOptions(data) : [];
  }, [data]);

  console.log(options);

  return <Select {...props} value={value} options={options} />;
};

export default KoulutusSelect;
