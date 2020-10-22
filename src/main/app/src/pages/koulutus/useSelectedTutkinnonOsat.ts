import { useMemo } from 'react';
import _ from 'lodash/fp';
import { useFieldValue } from '#/src/hooks/form';

export const useSelectedTutkinnonOsat = () => {
  const tutkinnonosat = useFieldValue(`tutkinnonosat.osat`);
  return useMemo(
    () =>
      _.reduce(
        (resultOsat, { eperuste, koulutus, osat }) => [
          ...resultOsat,
          ..._.map(
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
