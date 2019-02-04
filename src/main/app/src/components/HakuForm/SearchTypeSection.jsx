import React from 'react';
import { Field } from 'redux-form';
import mapValues from 'lodash/mapValues';

import Typography from '../Typography';
import Radio, { RadioGroup } from '../Radio';
import ApiAsync from '../ApiAsync';
import { getKoodisto } from '../../apiUtils';
import {
  isArray,
  getFirstLanguageValue,
  arrayToTranslationObject,
} from '../../utils';
import Spacing from '../Spacing';

const getHakutavat = async ({ httpClient, apiUrls }) => {
  const hakutapa = await getKoodisto({
    koodistoUri: 'hakutapa',
    httpClient,
    apiUrls,
  });

  return isArray(hakutapa)
    ? hakutapa.map(({ metadata, koodiUri, versio }) => ({
        koodiUri: `${koodiUri}#${versio}`,
        nimi: mapValues(arrayToTranslationObject(metadata), ({ nimi }) => nimi),
      }))
    : [];
};

const getHakutapaOptions = hakutapa =>
  hakutapa.map(({ koodiUri, nimi }) => ({
    value: koodiUri,
    label: getFirstLanguageValue(nimi),
  }));

const renderRadioGroupField = ({ input, options }) => {
  return(
  <RadioGroup {...input}>
    {options.map(({ value, label }) => (
      <Radio value={value} key={value}>
        {label}
      </Radio>
    ))}
  </RadioGroup>
);};

const TargetGroupSection = () => {
  return (
    <ApiAsync promiseFn={getHakutavat}>
    {({ data })  => (
      <>
          <Spacing>
            <Typography variant="h6" marginBottom={2}>
              Valitse hakutapa
            </Typography>
            {isArray(data) ? (
            <Field name="type" component={renderRadioGroupField} options={getHakutapaOptions(data)} />
            ) : null}
          </Spacing>
          </>
        )}
      </ApiAsync>
  );
};

export default TargetGroupSection;

