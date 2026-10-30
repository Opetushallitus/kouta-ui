import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { FormFieldCheckboxGroup } from '#/src/components/formFields';
import { Field } from '#/src/components/formFields/Field';

import { getLanguageOptions } from '#/src/utils';

export const KieliversiotFields = ({ name = 'kieliversiot', ...props }) => {
  const { t } = useTranslation();
  const options = useMemo(() => getLanguageOptions(t), [t]);

  return (
    <Field
      name={name}
      required
      component={FormFieldCheckboxGroup}
      options={options}
      label={t('yleiset.valitseKieliversiot')}
      {...props}
    />
  );
};

export default KieliversiotFields;
