import React from 'react';
import { Field, FieldArray } from 'redux-form';
import { useTranslation } from 'react-i18next';
import { FormFieldEditor } from '#/src/components/formFields';
import FieldGroup from '#/src/components/FieldGroup';
import KokeetTaiLisanaytotFields from './KokeetTaiLisanaytotFields';

const TRANSLATION_BASE = 'valintaperustelomake.koeTaiLisanaytto';

export const KokeetTaiLisanaytotSection = ({
  name = 'valintakoe',
  language,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <FieldGroup title={t(`${TRANSLATION_BASE}.yleisKuvaus`)}>
        <Field name={`${name}.yleisKuvaus`} component={FormFieldEditor} />
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
