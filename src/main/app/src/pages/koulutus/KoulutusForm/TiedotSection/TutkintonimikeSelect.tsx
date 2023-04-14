import React, { useMemo } from 'react';

import AsyncKoodistoSelect from '#/src/components/AsyncKoodistoSelect';
import { useLanguageTab } from '#/src/contexts/LanguageTabContext';
import useKoodisto from '#/src/hooks/useKoodisto';
import { formatKoodiLabelWithArvo } from '#/src/utils';

// Koodistojen tyhjää kuvaavat arvot tarpeettomia, koska Select-komponentista voi poistaa valinnan ja koutaan voidaan tallentaa tyhjä arvo.
const UNKNOWN_TUTKINTONIMIKKEET = ['XX', '00000'];

export const TutkintonimikeSelect = ({ koodisto, ...props }) => {
  const { data } = useKoodisto({
    koodisto: koodisto ?? 'tutkintonimikekk',
  });

  const language = useLanguageTab();

  const koodistoData = useMemo(
    () =>
      data?.filter(
        ({ koodiArvo }) => !UNKNOWN_TUTKINTONIMIKKEET.includes(koodiArvo)
      ),
    [data]
  );

  return (
    <AsyncKoodistoSelect
      koodistoData={koodistoData}
      isMulti
      showAllOptions={true}
      formatKoodiLabel={formatKoodiLabelWithArvo}
      selectedLanguage={language}
      {...props}
    />
  );
};

export default TutkintonimikeSelect;
