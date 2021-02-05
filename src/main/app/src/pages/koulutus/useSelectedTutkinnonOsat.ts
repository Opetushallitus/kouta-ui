import { useMemo } from 'react';

import _fp from 'lodash/fp';

import { useFieldValue } from '#/src/hooks/form';

export const useSelectedTutkinnonOsat = () => {
  const tutkinnonosat = useFieldValue(`tutkinnonosat.osat`);
  return useMemo(
    () =>
      _fp.reduce(
        (resultOsat, { eperuste, koulutus, osat }) => [
          ...resultOsat,
          ..._fp.map(
            ({ value, viite }) => ({
              ePerusteId: Number(eperuste?.value),
              koulutusKoodiUri: koulutus?.value,
              tutkinnonosaId: Number(value),
              tutkinnonosaViite: Number(viite),
            }),
            osat
          ),
        ],
        []
      )(tutkinnonosat),
    [tutkinnonosat]
  );
};
