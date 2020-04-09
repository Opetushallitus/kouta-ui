import React from 'react';
import { Field } from 'redux-form';

import { FormFieldEditor, FormFieldInput } from '../formFields';
import { useTranslation } from 'react-i18next';
import Spacing from '../Spacing';
import { getTestIdProps } from '../../utils';

export const KieliversiotSection = ({ name, language }) => {
  const { t } = useTranslation();

  return (
    <>
      <div {...getTestIdProps('nimi')}>
        <Spacing marginBottom={2}>
          <Field
            name={`${name}.nimi.${language}`}
            label={t('yleiset.nimi')}
            component={FormFieldInput}
          />
        </Spacing>
      </div>
      <div {...getTestIdProps('kuvaus')}>
        <Field
          name={`${name}.kuvaus.${language}`}
          label={t('yleiset.kuvaus')}
          component={FormFieldEditor}
        />
      </div>
    </>
  );
};

export default KieliversiotSection;
