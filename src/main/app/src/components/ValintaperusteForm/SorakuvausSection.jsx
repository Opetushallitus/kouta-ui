import React from 'react';
import { Field } from 'redux-form';

import Typography from '../Typography';
import Select from '../Select';
import ApiAsync from '../ApiAsync';
import { getFirstLanguageValue } from '../../utils';

const nop = () => {};

const getSorakuvaukset = async ({
  httpClient,
  apiUrls,
}) => {
  return [];
};

const getSorakuvauksetOptions = valintaperusteet =>
  valintaperusteet.map(({ nimi, id }) => ({
    value: id,
    label: getFirstLanguageValue(nimi),
  }));

const renderSelectField = ({ input, ...props }) => (
  <Select {...input} {...props} onBlur={nop} />
);

const SorakuvausSection = () => {
  return (
    <>
      <Typography variant="h6" marginBottom={1}>
        Valitse käytettävä sorakuvaus
      </Typography>
      <ApiAsync
        promiseFn={getSorakuvaukset}
      >
        {({ data }) => (
          <Field
            name="sorakuvaus"
            component={renderSelectField}
            options={getSorakuvauksetOptions(data || [])}
          />
        )}
      </ApiAsync>
    </>
  );
};

export default SorakuvausSection;
