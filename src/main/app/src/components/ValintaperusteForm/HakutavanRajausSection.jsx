import React from 'react';
import { Field } from 'redux-form';
import mapValues from 'lodash/mapValues';

import Typography from '../Typography';
import Radio, { RadioGroup } from '../Radio';
import ApiAsync from '../ApiAsync';
import { getKoodisto } from '../../apiUtils';

import {
  getFirstLanguageValue,
  isArray,
  arrayToTranslationObject,
} from '../../utils';

const getHakutavat = async ({
  httpClient,
  apiUrls,
}) => {
  const hakutavat = await getKoodisto({
    koodistoUri: 'hakutapa',
    httpClient,
    apiUrls,
  });

  return isArray(hakutavat)
    ? hakutavat.map(({ metadata, koodiUri, versio }) => ({
        koodiUri: `${koodiUri}#${versio}`,
        nimi: mapValues(arrayToTranslationObject(metadata), ({ nimi }) => nimi),
      }))
    : [];
};

const getHakutapaOptions = hakutavat =>
  hakutavat.map(({ nimi, koodiUri }) => ({
    value: koodiUri,
    label: getFirstLanguageValue(nimi),
  }));

const renderRadioGroupField = ({ input, options }) => (
  <RadioGroup {...input}>
    {options.map(({ value, label }) => (
      <Radio value={value} key={value}>{label}</Radio>
    ))}
  </RadioGroup>
);

const HakutavanRajausSection = () => {
  return (
    <>
      <Typography variant="h6" marginBottom={1}>
        Valitse hakutapa
      </Typography>
      <ApiAsync
        promiseFn={getHakutavat}
      >
        {({ data }) => (
          <Field
            name="hakutapa"
            component={renderRadioGroupField}
            options={getHakutapaOptions(data || [])}
          />
        )}
      </ApiAsync>
    </>
  );
};

export default HakutavanRajausSection;
