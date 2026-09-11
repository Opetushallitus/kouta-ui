import React from 'react';

import { useTranslation } from 'react-i18next';

import { FormFieldCheckbox } from '#/src/components/formFields';
import { Field } from '#/src/components/formFields/Field';

export const JulkisuusSection = ({ entity, name }) => {
  const { t } = useTranslation();
  const entityName = t(`yleiset.${entity}`);
  return (
    <Field
      name={name}
      component={FormFieldCheckbox}
      label={t(`${entity}lomake.julkisuusKuvaus`)}
    >
      {t(`yleiset.onJulkinen`, { entity: entityName })}
    </Field>
  );
};

export default JulkisuusSection;
