import React from 'react';
import { Field, FieldArray } from 'redux-form';
import { useTranslation } from 'react-i18next';
import { FormFieldEditor } from '#/src/components/formFields';
import FieldGroup from '#/src/components/FieldGroup';
import KokeetTaiLisanaytotFields from './KokeetTaiLisanaytotFields';
import { getTestIdProps } from '#/src/utils';
import Box from '#/src/components/Box';

const TRANSLATION_BASE = 'valintaperustelomake.koeTaiLisanaytto';

export const KokeetTaiLisanaytotSection = ({ name, language }) => {
  const { t } = useTranslation();
  return (
    <>
      <FieldGroup title={t(`${TRANSLATION_BASE}.yleisKuvaus`)}>
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
        translationBase={TRANSLATION_BASE}
        t={t}
      />
    </>
  );
};

export default KokeetTaiLisanaytotSection;
