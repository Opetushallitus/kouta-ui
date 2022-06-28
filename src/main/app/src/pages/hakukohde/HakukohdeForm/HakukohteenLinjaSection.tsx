import React, { useMemo } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { Field, FieldArray } from 'redux-form';

import { FieldGroup } from '#/src/components/FieldGroup';
import {
  FormFieldEditor,
  FormFieldRadioGroup,
  FormFieldInput,
} from '#/src/components/formFields';
import { Box, Spin } from '#/src/components/virkailija';
import { LANGUAGES, LUKIO_YLEISLINJA } from '#/src/constants';
import { useFieldValue, useSetFieldValue } from '#/src/hooks/form';
import useKoodisto from '#/src/hooks/useKoodisto';
import { useKoodistoDataOptions } from '#/src/hooks/useKoodistoOptions';
import { ToteutusModel } from '#/src/types/toteutusTypes';
import { getTestIdProps } from '#/src/utils';
import {
  arrayToTranslationObject,
  getLanguageValue,
} from '#/src/utils/languageUtils';

import PainotetutArvosanatFields from './PainotetutArvosanatFields';

type Props = {
  name: TranslatedField;
  language: LanguageCode;
  toteutus: ToteutusModel;
  nimiFieldPath: string;
};

const koodiToKoodiUri = koodi => `${koodi?.koodiUri}#${koodi.versio}`;

const mapKoodiToTranslateable = koodi => ({
  koodiUri: koodiToKoodiUri(koodi),
  nimi: _fp.mapValues(
    _fp.prop('nimi'),
    arrayToTranslationObject(koodi?.metadata)
  ),
});

const useLukiolinjaKoodit = toteutus => {
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

export const HakukohteenLinjaSection = ({
  name,
  language,
  toteutus,
  nimiFieldPath,
  koulutus,
}: Props) => {
  const { t } = useTranslation();

  const { loading, options, nimiLookupArray } = useLukiolinjaKoodit(toteutus);

  const linja = useFieldValue(`${name}.linja`);
  const hakukohdeNimi = useMemo(
    () => nimiLookupArray.find(v => v.koodiUri === linja)?.nimi,
    [linja, nimiLookupArray]
  );

  useSetFieldValue(nimiFieldPath, hakukohdeNimi);

  return loading ? (
    <Spin />
  ) : (
    <>
      <Box {...getTestIdProps('valitseHakukohteenLinja')} mb={4}>
        <Field
          label={t('hakukohdelomake.valitseHakukohteenLinja')}
          component={FormFieldRadioGroup}
          options={options}
          name={`${name}.linja`}
          required
        />
      </Box>
      {linja && (
        <FieldGroup
          title={
            getLanguageValue(hakukohdeNimi, language) ||
            t('hakukohdelomake.hakukohteenLinja')
          }
        >
          <Box {...getTestIdProps('alinHyvaksytty')} mb={2}>
            <Field
              component={FormFieldInput}
              name={`${name}.alinHyvaksyttyKeskiarvo`}
              type="number"
              label={t('hakukohdelomake.alinHyvaksyttyKeskiarvo')}
            />
          </Box>

          <Box {...getTestIdProps('linjaLisatietoa')}>
            <Field
              name={`${name}.lisatietoa.${language}`}
              component={FormFieldEditor}
              label={t('yleiset.lisatietoa')}
            />
          </Box>

          <FieldGroup
            title={t('hakukohdelomake.painotetutArvosanat')}
            {...getTestIdProps('painotetutArvosanat')}
          >
            <FieldArray
              name={`${name}.painotetutArvosanat`}
              component={PainotetutArvosanatFields}
            />
          </FieldGroup>
        </FieldGroup>
      )}
    </>
  );
};
