import React from 'react';
import { Field } from 'redux-form';

import Spacing from '../../Spacing';
import useTranslation from '../../useTranslation';
import { getTestIdProps } from '../../../utils';
import { FormFieldInput, FormFieldTextarea } from '../../FormFields';

export const KorkeakouluKuvausSection = ({ language, name }) => {
  const { t } = useTranslation();

  return (
    <>
      <Spacing marginBottom={2} {...getTestIdProps('kuvauksenNimiInput')}>
        <Field
          name={`${name}.nimi.${language}`}
          component={FormFieldInput}
          label={t('yleiset.kuvauksenNimi')}
        />
      </Spacing>
      <Spacing {...getTestIdProps('kuvausInput')}>
        <Field
          name={`${name}.kuvaus.${language}`}
          component={FormFieldTextarea}
          label={t('yleiset.kuvaus')}
        />
      </Spacing>
    </>
  );
};

export default KorkeakouluKuvausSection;
