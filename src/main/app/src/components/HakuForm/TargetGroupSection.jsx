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

const getHaunKohdejoukot = async ({ httpClient, apiUrls }) => {
  const haunkohdejoukko = await getKoodisto({
    koodistoUri: 'haunkohdejoukko',
    httpClient,
    apiUrls,
  });

  return isArray(haunkohdejoukko)
    ? haunkohdejoukko.map(({ metadata, koodiUri, versio }) => ({
        koodiUri: `${koodiUri}#${versio}`,
        nimi: mapValues(arrayToTranslationObject(metadata), ({ nimi }) => nimi),
      }))
    : [];
};

const getKohdejoukkoOptions = haunkohdejoukko =>
  haunkohdejoukko.map(({ koodiUri, nimi }) => ({
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
    <ApiAsync promiseFn={getHaunKohdejoukot}>
    {({ data })  => (
      <>
          <Spacing>
            <Typography variant="h6" marginBottom={2}>
              Haun kohdejoukko
            </Typography>
            {isArray(data) ? (
            <Field name="kohde" component={renderRadioGroupField} options={getKohdejoukkoOptions(data)} />
            ) : null}
          </Spacing>
          </>
        )}
      </ApiAsync>
  );
};

export default TargetGroupSection;
