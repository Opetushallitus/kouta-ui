import React from 'react';
import { Field } from 'redux-form';
import mapValues from 'lodash/mapValues';

import Radio, { RadioGroup } from '../Radio';
import Typography from '../Typography';
import { getKoodisto } from '../../apiUtils';
import ApiAsync from '../ApiAsync';

import {
  isArray,
  getFirstLanguageValue,
  arrayToTranslationObject,
} from '../../utils';

const getPohjokoulutusvaatimukset = async ({ httpClient, apiUrls }) => {
  const vaatimukset = await getKoodisto({
    koodistoUri: 'pohjakoulutusvaatimustoinenaste',
    httpClient,
    apiUrls,
  });

  return isArray(vaatimukset)
    ? vaatimukset.map(({ metadata, koodiUri, versio }) => ({
        koodiUri: `${koodiUri}#${versio}`,
        nimi: mapValues(arrayToTranslationObject(metadata), ({ nimi }) => nimi),
      }))
    : [];
};

const renderRadioGroupField = ({ input, options }) => (
  <RadioGroup {...input}>
    {options.map(({ value, label }) => (
      <Radio value={value} key={value}>
        {label}
      </Radio>
    ))}
  </RadioGroup>
);

const getVaatimusOptions = vaatimukset =>
  vaatimukset.map(({ koodiUri, nimi }) => ({
    value: koodiUri,
    label: getFirstLanguageValue(nimi),
  }));

const PohjakoulutusSection = () => {
  return (
    <>
      <Typography variant="h6" marginBottom={1}>
        Valitse pohjakoulutusvaatimus
      </Typography>
      <ApiAsync promiseFn={getPohjokoulutusvaatimukset}>
        {({ data }) => (
          <Field name="koulutusvaatimus" component={renderRadioGroupField} options={data ? getVaatimusOptions(data) : []} />
        )}
      </ApiAsync>
    </>
  );
};

export default PohjakoulutusSection;
