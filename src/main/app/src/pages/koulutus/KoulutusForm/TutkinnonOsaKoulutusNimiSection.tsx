import React, { useEffect } from 'react';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';
import { Box } from '#/src/components/virkailija';
import {
  useBoundFormActions,
  useFieldValue,
  useIsDirty,
} from '#/src/hooks/form';
import { getLanguageValue } from '#/src/utils/languageUtils';
import { getTestIdProps, oneAndOnlyOne } from '#/src/utils';
import { FormFieldInput } from '#/src/components/formFields';

export const TutkinnonOsaKoulutusNimiSection = ({
  language,
  name,
  disabled,
}) => {
  const { t } = useTranslation();
  const tutkinnonosat = useFieldValue(`${name}.osat`);

  const oneSelectedTutkinnonOsa = oneAndOnlyOne(
    tutkinnonosat?.flatMap(t => t.selectedTutkinnonosat?.nimi)
  );

  const { change } = useBoundFormActions();
  const isDirty = useIsDirty();

  useEffect(() => {
    if (isDirty && oneSelectedTutkinnonOsa) {
      change(
        `${name}.nimi.${language}`,
        getLanguageValue(oneSelectedTutkinnonOsa, language)
      );
    }
  }, [change, name, isDirty, oneSelectedTutkinnonOsa, language]);

  return (
    <Box mb={2} {...getTestIdProps('koulutuksenNimi')}>
      <Field
        disabled={disabled || oneSelectedTutkinnonOsa}
        name={`${name}.nimi.${language}`}
        component={FormFieldInput}
        label={t('koulutuslomake.lisaaKoulutuksenNimi')}
      />
    </Box>
  );
};
