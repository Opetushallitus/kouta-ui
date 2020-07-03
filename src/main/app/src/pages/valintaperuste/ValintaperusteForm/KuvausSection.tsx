import React from 'react';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';

import { FormFieldEditor, FormFieldInput } from '#/src/components/formFields';
import Spacing from '#/src/components/Spacing';
import { getTestIdProps } from '#/src/utils';

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
