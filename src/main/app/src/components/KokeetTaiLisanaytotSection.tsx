import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field, FieldArray } from 'redux-form';

import { FieldGroup } from '#/src/components/FieldGroup';
import { FormFieldEditor } from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';
import { getTestIdProps } from '#/src/utils';

import { KokeetTaiLisanaytotFields } from './KokeetTaiLisanaytotFields';

export const KokeetTaiLisanaytotSection = ({ name, language }) => {
  const { t } = useTranslation();
  return (
    <>
      <FieldGroup title={t('koeTaiLisanaytto.yleisKuvaus')}>
        <Box ml={12} mr={12} {...getTestIdProps('yleisKuvaus')}>
          <Field
            name={`${name}.yleisKuvaus.${language}`}
            component={FormFieldEditor}
          />
        </Box>
      </FieldGroup>
      <FieldArray
        name={`${name}.kokeetTaiLisanaytot`}
        component={KokeetTaiLisanaytotFields}
        language={language}
        t={t}
      />
    </>
  );
};
