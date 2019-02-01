import React from 'react';
import { Field } from 'redux-form';
import mapValues from 'lodash/mapValues';

import Typography from '../Typography';
import Select from '../Select';
import ApiAsync from '../ApiAsync';
import { getKoodisto } from '../../apiUtils';
import {
  getFirstLanguageValue,
  isArray,
  arrayToTranslationObject,
} from '../../utils';

const nop = () => {};

const getKohdejoukko = async ({
  httpClient,
  apiUrls,
}) => {
  const kohdejoukko = await getKoodisto({
    koodistoUri: 'haunkohdejoukko',
    httpClient,
    apiUrls,
  });

  return isArray(kohdejoukko)
    ? kohdejoukko.map(({ metadata, koodiUri, versio }) => ({
        koodiUri: `${koodiUri}#${versio}`,
        nimi: mapValues(arrayToTranslationObject(metadata), ({ nimi }) => nimi),
      }))
    : [];
};

const getKohdejoukkoOptions = kohdejoukko =>
  kohdejoukko.map(({ nimi, koodiUri }) => ({
    value: koodiUri,
    label: getFirstLanguageValue(nimi),
  }));

const renderSelectField = ({ input, ...props }) => (
  <Select {...input} {...props} onBlur={nop} />
);

const KohdejoukonRajausSection = () => {
  return (
    <>
      <Typography variant="h6" marginBottom={1}>
        Valitse kohdejoukko
      </Typography>
      <ApiAsync
        promiseFn={getKohdejoukko}
      >
        {({ data }) => (
          <Field
            name="kohdejoukko"
            component={renderSelectField}
            options={getKohdejoukkoOptions(data || [])}
          />
        )}
      </ApiAsync>
    </>
  );
};

export default KohdejoukonRajausSection;
