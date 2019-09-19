import React from 'react';
import { Field } from 'redux-form';

import Spacing from '../Spacing';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import { FormFieldInput } from '../formFields';

const YhteystiedotSection = ({ language }) => {
  const { t } = useTranslation();

  return (
    <>
      <Spacing marginBottom={2} {...getTestIdProps('nimi')}>
        <Field
          name={`name.${language}`}
          label={t('yleiset.nimi')}
          component={FormFieldInput}
        />
      </Spacing>
      <Spacing marginBottom={2} {...getTestIdProps('titteli')}>
        <Field
          name={`title.${language}`}
          label={t('yleiset.titteli')}
          component={FormFieldInput}
        />
      </Spacing>
      <Spacing marginBottom={2} {...getTestIdProps('sahkoposti')}>
        <Field
          name={`email.${language}`}
          type="email"
          label={t('yleiset.sahkoposti')}
          component={FormFieldInput}
        />
      </Spacing>
      <Spacing marginBottom={2} {...getTestIdProps('puhelin')}>
        <Field
          name={`phone.${language}`}
          label={t('yleiset.puhelin')}
          component={FormFieldInput}
        />
      </Spacing>
      <Spacing {...getTestIdProps('verkkosivu')}>
        <Field
          name={`website.${language}`}
          label={t('yleiset.verkkosivu')}
          component={FormFieldInput}
        />
      </Spacing>
    </>
  );
};

export default YhteystiedotSection;
