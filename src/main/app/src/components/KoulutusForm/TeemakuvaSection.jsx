import React from 'react';
import { Field } from 'redux-form';

import useTranslation from '../useTranslation';
import { FormFieldFileInput } from '../formFields';
import { getBinary } from '../../utils';

export const TeemakuvaSection = ({ name }) => {
  const { t } = useTranslation();

  return (
    <Field
      name={name}
      label={'Teemakuva'}
      component={FormFieldFileInput}
      upload={async (file) => {
        // TODO: implement real teemakuva upload
        const binary = await getBinary(file);
        return Promise.resolve([URL.createObjectURL(file)])
      }}
      //accept={'image/jpeg', 'image/png'}
    ></Field>
  );
};

export default TeemakuvaSection;
