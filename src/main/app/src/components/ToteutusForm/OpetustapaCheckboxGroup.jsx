import React from 'react';

import { getKoodisto } from '../../apiUtils';
import ApiAsync from '../ApiAsync';
import CheckboxGroup from '../CheckboxGroup';
import { isArray, getFirstLanguageValue } from '../../utils';

const getOpetustapaKoodisto = async ({ httpClient, apiUrls }) => {
  const koodisto = await getKoodisto({
    koodistoUri: 'opetuspaikkakk',
    httpClient,
    apiUrls,
  });

  if (!isArray(koodisto)) {
    return [];
  }

  return koodisto.map(({ metadata = [], koodiUri, versio }) => ({
    koodiUri: `${koodiUri}#${versio}`,
    nimi: metadata.reduce((acc, { kieli, nimi }) => {
      acc[kieli.toLowerCase()] = nimi;

      return acc;
    }, {}),
  }));
};

const getOptions = koodisto => {
  return koodisto.map(({ nimi, koodiUri }) => ({
    label: getFirstLanguageValue(nimi),
    value: koodiUri,
  }));
};

const OpetustapaCheckboxGroup = props => {
  return (
    <ApiAsync promiseFn={getOpetustapaKoodisto}>
      {({ data }) =>
        data ? (
          <CheckboxGroup options={getOptions(data || [])} {...props} />
        ) : null
      }
    </ApiAsync>
  );
};

export default OpetustapaCheckboxGroup;
