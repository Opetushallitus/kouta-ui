import { useMemo } from 'react';

import { useFieldValue } from '#/src/hooks/form';

type TutkinnonosatOsatFieldValue = Array<{
  eperuste?: SelectOption<string>;
  koulutus?: SelectOption<string>;
  osat?: Array<{ value: string | number; viite: string | number }>;
}>;

type SelectedTutkinnonOsa = {
  ePerusteId: number;
  koulutusKoodiUri: string | undefined;
  tutkinnonosaId: number;
  tutkinnonosaViite: number;
};

export const useSelectedTutkinnonOsat = () => {
  const tutkinnonosat = useFieldValue<TutkinnonosatOsatFieldValue | undefined>(
    `tutkinnonosat.osat`
  );
  return useMemo(
    () =>
      tutkinnonosat?.reduce<Array<SelectedTutkinnonOsa>>(
        (resultOsat, { eperuste, koulutus, osat }) => [
          ...resultOsat,
          ...(osat?.map(({ value, viite }) => ({
            ePerusteId: Number(eperuste?.value),
            koulutusKoodiUri: koulutus?.value,
            tutkinnonosaId: Number(value),
            tutkinnonosaViite: Number(viite),
          })) || []),
        ],
        []
      ),
    [tutkinnonosat]
  );
};
