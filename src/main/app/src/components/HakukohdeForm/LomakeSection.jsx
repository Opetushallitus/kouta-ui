import React from 'react';
import { Field } from 'redux-form';

import LomakeFields from '../LomakeFields';
import { FormFieldCheckbox } from '../FormFields';
import useTranslation from '../useTranslation';
import Spacing from '../Spacing';
import { getTestIdProps } from '../../utils';

const ConditionalLomakeFields = ({
  input: { value },
  fieldsName,
  language,
}) => {
  return value ? (
    <Spacing marginTop={2}>
      <LomakeFields name={fieldsName} language={language} />
    </Spacing>
  ) : null;
};

const LomakeSection = ({ language }) => {
  const { t } = useTranslation();

  return (
    <>
      <div {...getTestIdProps('eriHakulomake')}>
        <Field name="hakulomake.eriHakulomake" component={FormFieldCheckbox}>
          {t('hakukohdelomake.eriHakulomake')}
        </Field>
      </div>
      <Field
        component={ConditionalLomakeFields}
        name="hakulomake.eriHakulomake"
        fieldsName="hakulomake"
        language={language}
      />
    </>
  );
};

export default LomakeSection;
