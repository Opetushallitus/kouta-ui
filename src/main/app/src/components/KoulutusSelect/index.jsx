import React from 'react';
import mapValues from 'lodash/mapValues';

import ApiAsync from '../ApiAsync';
import memoize from 'memoizee';

import Select from '../Select';
import { getKoulutuksetByKoulutusTyyppi } from '../../apiUtils';
import { arrayToTranslationObject, isArray, getFirstLanguageValue } from '../../utils';

const getKoulutukset = async ({ koulutusTyyppi, httpClient, apiUrls }) => {
  const koulutukset = await getKoulutuksetByKoulutusTyyppi({
    koulutusTyyppi,
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

const getOptions = memoize(koulutukset => {
  return koulutukset.map(({ nimi, koodiUri }) => ({
    value: koodiUri,
    label: getFirstLanguageValue(nimi),
  }))
});

const KoulutusSelect = ({
  koulutusTyyppi = 'amm',
  language = 'fi',
  value,
  ...props
}) => {
  return (
    <ApiAsync
      promiseFn={getKoulutukset}
      watch={koulutusTyyppi}
      koulutusTyyppi={koulutusTyyppi}
    >
      {({ data }) => {
        const koulutukset = data || [];

        return <Select {...props} value={value} options={getOptions(koulutukset)} />;
      }}
    </ApiAsync>
  );
};

export default KoulutusSelect;
