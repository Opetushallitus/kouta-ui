import { useMemo } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import { LANGUAGES, LUKIO_YLEISLINJA } from '#/src/constants';
import useKoodisto from '#/src/hooks/useKoodisto';
import { useKoodistoDataOptions } from '#/src/hooks/useKoodistoOptions';
import { arrayToTranslationObject } from '#/src/utils/languageUtils';

const koodiToKoodiUri = koodi => `${koodi?.koodiUri}#${koodi.versio}`;

const mapKoodiToTranslateable = koodi => ({
  koodiUri: koodiToKoodiUri(koodi),
  nimi: _fp.mapValues(
    _fp.prop('nimi'),
    arrayToTranslationObject(koodi?.metadata)
  ),
});

export const useLukiolinjaKoodit = toteutus => {
  const { t } = useTranslation();

  // Haetaan koko koodistot hakukohteen nimen tallennusta varten
  const { data: lukiopainotukset = [], isLoading: painotuksetLoading } =
    useKoodisto({
      koodisto: 'lukiopainotukset',
    });
  const painotusOptions = useKoodistoDataOptions({
    koodistoData: lukiopainotukset,
  });

  const { data: erityisetKoulutusTehtavat = [], isLoading: erityisetLoading } =
    useKoodisto({
      koodisto: 'lukiolinjaterityinenkoulutustehtava',
    });
  const erityisOptions = useKoodistoDataOptions({
    koodistoData: erityisetKoulutusTehtavat,
  });

  const loading = painotuksetLoading || erityisetLoading;

  const yleislinja = toteutus?.metadata?.yleislinja;

  const availableOptionIds = useMemo(
    () =>
      [
        ...(toteutus?.metadata?.painotukset ?? []),
        ...(toteutus?.metadata?.erityisetKoulutustehtavat ?? []),
      ].map(v => v.koodiUri),
    [toteutus]
  );

  const options = useMemo(() => {
    const filterValues = v => availableOptionIds.some(id => id === v.value);

    return [
      ...(yleislinja
        ? [
            {
              value: LUKIO_YLEISLINJA,
              label: t('hakukohdelomake.lukionYleislinja'),
            },
          ]
        : []),
      ...painotusOptions.filter(filterValues),
      ...erityisOptions.filter(filterValues),
    ];
  }, [yleislinja, availableOptionIds, erityisOptions, painotusOptions, t]);

  // Tarvitaan kaikki käännökset yleislinjalle hakukohteen nimeä varten
  const yleislinjaTranslations = useMemo(
    () =>
      LANGUAGES.reduce(
        (a, lng) => ({
          ...a,
          [lng]: t('hakukohdelomake.lukionYleislinja', { lng }),
        }),
        {}
      ),
    [t]
  );

  const nimiLookupArray = useMemo(
    () => [
      { koodiUri: LUKIO_YLEISLINJA, nimi: yleislinjaTranslations },
      ...lukiopainotukset
        .concat(erityisetKoulutusTehtavat)
        .map(mapKoodiToTranslateable),
    ],
    [yleislinjaTranslations, lukiopainotukset, erityisetKoulutusTehtavat]
  );

  return { loading, options, nimiLookupArray };
};
