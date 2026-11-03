import { useTranslation } from 'react-i18next';

import { FormFieldSwitch } from '#/src/components/formFields';
import { Field } from '#/src/components/formFields/Field';
import { getTestIdProps } from '#/src/utils';

type AvoinKorkeakoulutusFieldProps = {
  name: string;
};

export const AvoinKorkeakoulutusField = ({
  name,
}: AvoinKorkeakoulutusFieldProps) => {
  const { t } = useTranslation();

  return (
    <div {...getTestIdProps('isAvoinKorkeakoulutus')}>
      <Field name={`${name}.isAvoinKorkeakoulutus`} component={FormFieldSwitch}>
        {t('yleiset.isAvoinKorkeakoulutus')}
      </Field>
    </div>
  );
};
