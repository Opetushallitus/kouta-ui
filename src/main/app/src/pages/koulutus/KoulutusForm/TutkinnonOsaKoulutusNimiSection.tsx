import React, { useEffect, useState } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldInput } from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';
import { useBoundFormActions, useIsDirty } from '#/src/hooks/form';
import { getTestIdProps, oneAndOnlyOne } from '#/src/utils';
import { useEPerusteTutkinnonOsat } from '#/src/utils/koulutus/getTutkinnonosaViite';
import { getLanguageValue } from '#/src/utils/languageUtils';

import { useSelectedTutkinnonOsat } from '../useSelectedTutkinnonOsat';

type TutkinnonOsaKoulutusNimiSectionProps = {
  language: LanguageCode;
  languages: Array<LanguageCode>;
  name: string;
  disabled?: boolean;
};

export const TutkinnonOsaKoulutusNimiSection: React.FC<
  TutkinnonOsaKoulutusNimiSectionProps
> = ({ language, languages, name, disabled }) => {
  const { t } = useTranslation();

  const [selectedTutkinnonosa, setSelectedTutkinnonosa] = useState(null);

  const tutkinnonosat = useSelectedTutkinnonOsat();

  const oneSelectedTutkinnonOsa = oneAndOnlyOne(tutkinnonosat);

  const {
    data: ePerusteTutkinnonOsat,
    isLoading: ePerusteTutkinnonOsatIsLoading,
  } = useEPerusteTutkinnonOsat({
    ePerusteId: oneSelectedTutkinnonOsa?.ePerusteId,
  });

  const selectedTutkinnonosaNimi = ePerusteTutkinnonOsat?.find(
    t => t.id === oneSelectedTutkinnonOsa?.tutkinnonosaViite
  )?.nimi;

  const { change } = useBoundFormActions();
  const isDirty = useIsDirty();

  const changeNimi =
    isDirty &&
    oneSelectedTutkinnonOsa?.tutkinnonosaViite &&
    oneSelectedTutkinnonOsa?.tutkinnonosaViite !== selectedTutkinnonosa;

  useEffect(() => {
    if (!ePerusteTutkinnonOsatIsLoading) {
      if (changeNimi) {
        _fp.each(lang => {
          change(
            `${name}.nimi.${lang}`,
            selectedTutkinnonosaNimi
              ? getLanguageValue(selectedTutkinnonosaNimi, lang)
              : null
          );
        }, languages);
      }
      setSelectedTutkinnonosa(oneSelectedTutkinnonOsa?.tutkinnonosaViite);
    }
  }, [
    change,
    name,
    language,
    selectedTutkinnonosaNimi,
    languages,
    changeNimi,
    oneSelectedTutkinnonOsa,
    ePerusteTutkinnonOsatIsLoading,
  ]);

  return (
    <Box mb={2} {...getTestIdProps('koulutuksenNimi')}>
      <Field
        disabled={disabled}
        name={`${name}.nimi.${language}`}
        component={FormFieldInput}
        label={t('koulutuslomake.lisaaKoulutuksenNimi')}
        helperText={t('koulutuslomake.koulutuksenNimiNakyyOppijalleVaroitus')}
        required
      />
    </Box>
  );
};
