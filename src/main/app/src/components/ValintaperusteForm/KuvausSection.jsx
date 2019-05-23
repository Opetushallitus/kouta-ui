import React from 'react';
import { Field } from 'redux-form';

import useTranslation from '../useTranslation';
import { FormFieldEditor, FormFieldInput } from '../FormFields';
import Spacing from '../Spacing';
import { getTestIdProps } from '../../utils';

const KuvausSection = ({ language, name }) => {
  const { t } = useTranslation();

  return (
    <>
      <Spacing marginBottom={2} {...getTestIdProps('nimi')}>
        <Field
          name={`${name}.nimi.${language}`}
          component={FormFieldInput}
          label={t('valintaperustelomake.kuvauksenNimi')}
        />
      </Spacing>
      <Spacing {...getTestIdProps('kuvaus')}>
        <Field
          name={`${name}.kuvaus.${language}`}
          component={FormFieldEditor}
          label={t('valintaperustelomake.kuvauksenTarkenne')}
        />
      </Spacing>
    </>
  );
};

export default KuvausSection;
