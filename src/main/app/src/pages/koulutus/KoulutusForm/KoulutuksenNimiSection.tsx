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
import { getTestIdProps } from '#/src/utils';
import { FormFieldInput } from '#/src/components/formFields';

const oneAndOnlyOne = all => all && all.length === 1 && all[0];

export const KoulutuksenNimiSection = ({ language, name }) => {
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
        disabled={oneSelectedTutkinnonOsa}
        name={`${name}.nimi.${language}`}
        component={FormFieldInput}
        label={t('koulutuslomake.lisaaKoulutuksenNimi')}
      />
    </Box>
  );
};
