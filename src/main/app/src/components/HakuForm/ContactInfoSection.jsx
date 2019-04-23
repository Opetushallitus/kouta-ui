import React from 'react';
import { Field } from 'redux-form';

import useTranslation from '../useTranslation';
import Spacing from '../Spacing';
import { getTestIdProps } from '../../utils';
import { FormFieldInput } from '../FormFields';

const ContactInfoSection = ({ language, ...props }) => {
  const { t } = useTranslation();

  return (
    <>
      <Spacing marginBottom={2} {...getTestIdProps('nimi')}>
        <Field
          name={`nimi.${language}`}
          component={FormFieldInput}
          label={t('yleiset.nimi')}
        />
      </Spacing>
      <Spacing marginBottom={2} {...getTestIdProps('titteli')}>
        <Field
          name={`titteli.${language}`}
          component={FormFieldInput}
          label={t('yleiset.titteli')}
        />
      </Spacing>

      <Spacing marginBottom={2} {...getTestIdProps('sahkoposti')}>
        <Field
          name={`email.${language}`}
          component={FormFieldInput}
          label={t('yleiset.sahkoposti')}
        />
      </Spacing>

      <Spacing {...getTestIdProps('puhelin')}>
        <Field
          name={`puhelin.${language}`}
          component={FormFieldInput}
          label={t('yleiset.puhelin')}
        />
      </Spacing>
    </>
  );
};

export default ContactInfoSection;
