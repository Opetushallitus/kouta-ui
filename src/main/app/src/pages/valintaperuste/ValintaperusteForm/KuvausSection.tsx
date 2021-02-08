import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldEditor, FormFieldInput } from '#/src/components/formFields';
import { SisaltoFields } from '#/src/components/SisaltoFields';
import Spacing from '#/src/components/Spacing';
import { getTestIdProps } from '#/src/utils';

export const KuvausSection = ({ language, name }) => {
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
      <Spacing marginBottom={2} {...getTestIdProps('kuvaus')}>
        <Field
          name={`${name}.kuvaus.${language}`}
          component={FormFieldEditor}
          label={t('valintaperustelomake.kuvauksenTarkenne')}
        />
      </Spacing>
      <Spacing {...getTestIdProps('sisalto')}>
        <SisaltoFields name={`${name}.sisalto`} language={language} />
      </Spacing>
    </>
  );
};
