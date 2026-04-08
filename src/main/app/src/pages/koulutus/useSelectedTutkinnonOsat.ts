import { useMemo } from 'react';

import { useFieldValue } from '#/src/hooks/form';

export const useSelectedTutkinnonOsat = () => {
  const tutkinnonosat = useFieldValue(`tutkinnonosat.osat`);
  return useMemo(
    () =>
      tutkinnonosat?.reduce(
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
