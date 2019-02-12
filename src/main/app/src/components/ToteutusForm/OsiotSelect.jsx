import React from 'react';
import mapValues from 'lodash/mapValues';

import Select from '../Select';
import { getKoodisto } from '../../apiUtils';
import {
  isArray,
  arrayToTranslationObject,
  getFirstLanguageValue,
} from '../../utils';
import ApiAsync from '../ApiAsync';

const getOsiot = async ({ httpClient, apiUrls }) => {
  const osiot = await getKoodisto({
    koodistoUri: 'koulutuksenjarjestamisenlisaosiot',
    httpClient,
    apiUrls,
  });

  return isArray(osiot)
    ? osiot.map(({ metadata, koodiUri, versio }) => ({
        koodiUri: `${koodiUri}#${versio}`,
        nimi: mapValues(arrayToTranslationObject(metadata), ({ nimi }) => nimi),
      }))
    : [];
};

const getOsiotOptions = osiot =>
  osiot.map(({ nimi, koodiUri }) => ({
    value: koodiUri,
    label: getFirstLanguageValue(nimi),
  }));

const OsiotSelect = props => {
  return (
    <ApiAsync promiseFn={getOsiot}>
      {({ data }) => (
        <Select
          options={getOsiotOptions(data || [])}
          isMulti
          {...props}
        />
      )}
    </ApiAsync>
  );
};

export default OsiotSelect;
