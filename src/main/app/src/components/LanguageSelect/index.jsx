import React from 'react';
import mapValues from 'lodash/mapValues';
import memoize from 'memoizee';

import Select from '../Select';
import { getKoodisto } from '../../apiUtils';
import { isArray, arrayToTranslationObject, getFirstLanguageValue } from '../../utils';
import ApiAsync from '../ApiAsync';

const getKieliKoodisto = memoize((httpClient, apiUrls) => {
  return getKoodisto({
    koodistoUri: 'kieli',
    httpClient,
    apiUrls,
  });
}, { promise: true });

const getKielet = async ({
  httpClient,
  apiUrls,
}) => {
  const kielet = await getKieliKoodisto(httpClient, apiUrls);

  return isArray(kielet)
    ? kielet.map(({ metadata, koodiUri, versio }) => ({
        koodiUri: `${koodiUri}#${versio}`,
        nimi: mapValues(arrayToTranslationObject(metadata), ({ nimi }) => nimi),
      }))
    : [];
};

const getKieliOptions = memoize((kielet, language) =>
  kielet.map(({ nimi, koodiUri }) => ({
    value: koodiUri,
    label: getFirstLanguageValue(nimi, language),
  }))
);

const LanguageSelect = ({ language = 'fi', props }) => {
  return (
    <ApiAsync promiseFn={getKielet}>
      {({ data }) => (
        <Select options={getKieliOptions(data || [], language)} {...props} />
      )}
    </ApiAsync>
  );
};

export default LanguageSelect;
