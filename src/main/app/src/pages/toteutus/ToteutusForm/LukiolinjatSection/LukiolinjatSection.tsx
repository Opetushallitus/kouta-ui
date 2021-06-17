import React, { useMemo } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import FieldGroup from '#/src/components/FieldGroup';
import { FormFieldEditor, FormFieldSwitch } from '#/src/components/formFields';
import { KoodistoCollapseList } from '#/src/components/KoodistoCollapseList';
import Spacing from '#/src/components/Spacing';
import { Box } from '#/src/components/virkailija';
import { LANGUAGES } from '#/src/constants';
import { useLanguageTab } from '#/src/contexts/LanguageTabContext';
import { useFieldValue, useSetFieldValue } from '#/src/hooks/form';
import { useKoodisto } from '#/src/hooks/useKoodisto';
import { getTestIdProps } from '#/src/utils';
import { koodiUriWithoutVersion } from '#/src/utils/koodi/koodiUriWithoutVersion';
import parseKoodiUri from '#/src/utils/koodi/parseKoodiUri';
import { arrayToTranslationObject } from '#/src/utils/languageUtils';
import { mapValues } from '#/src/utils/lodashFpUncapped';

const LukiolinjaKuvaus = ({ name, itemProps, index }) => {
  const languageTab = useLanguageTab();

  return (
    <Field
      component={FormFieldEditor}
      label={itemProps?.kuvausLabel}
      name={`${name}.kuvaukset[${index}].${languageTab}`}
    />
  );
};

const mapKoodiToTranslateable = koodi =>
  koodi
    ? mapValues(_fp.prop('nimi'), arrayToTranslationObject(koodi?.metadata))
    : undefined;

const LukiolinjaOsio = ({
  name,
  title,
  isKaytossaLabel,
  valinnatLabel,
  kuvausLabel,
  koodistoData,
  ...props
}) => {
  const isKaytossa = useFieldValue(`${name}.kaytossa`);

  return (
    <FieldGroup title={title} {...props}>
      <Box mb={2}>
        <Field component={FormFieldSwitch} name={`${name}.kaytossa`}>
          {isKaytossaLabel}
        </Field>
      </Box>
      {isKaytossa && (
        <>
          <KoodistoCollapseList
            koodistoData={koodistoData}
            name={name}
            itemProps={{ kuvausLabel }}
            selectLabel={valinnatLabel}
            CollapseContent={LukiolinjaKuvaus}
          />
        </>
      )}
    </FieldGroup>
  );
};

const findTranslationsByKoodi = koodistoData => ({ value }) =>
  mapKoodiToTranslateable(
    koodistoData?.find(
      ({ koodiUri }) => koodiUriWithoutVersion(value) === koodiUri
    )
  );

const useSelectedOsioLinjat = osioFieldName => {
  const osioKaytossa = useFieldValue(`${osioFieldName}.kaytossa`);
  const selectedValinnat = useFieldValue(`${osioFieldName}.valinnat`);
  return useMemo(() => (osioKaytossa ? selectedValinnat : []), [
    osioKaytossa,
    selectedValinnat,
  ]);
};

const renderOpintojenLaajuus = (opintojenLaajuusNumero, t, lng) =>
  opintojenLaajuusNumero
    ? `, ${opintojenLaajuusNumero} ${t('yleiset.opintopistetta', {
        lng,
      })}`
    : '';

type UseLukioToteutusNimiProps = {
  yleislinjaSelected: boolean;
  selectedLinjatTranslations: Array<TranslatedField>;
  opintojenLaajuusNumero?: number;
};

export const useLukioToteutusNimi = ({
  yleislinjaSelected,
  selectedLinjatTranslations,
  opintojenLaajuusNumero,
}: UseLukioToteutusNimiProps) => {
  const { t } = useTranslation();

  const allLinjatTranslations = useMemo(
    () =>
      yleislinjaSelected
        ? [
            _fp.zipObject(
              LANGUAGES,
              LANGUAGES.map(
                lng =>
                  `${t('toteutuslomake.lukionYleislinja', {
                    lng,
                  })}`
              )
            ),
            ...selectedLinjatTranslations,
          ]
        : selectedLinjatTranslations,
    [t, yleislinjaSelected, selectedLinjatTranslations]
  );

  return useMemo(
    () =>
      mapValues((translatedNimiAcc: any, lng) =>
        _fp.reduce(
          (result, linjaTranslations) => {
            const translation = linjaTranslations[lng];
            if (!_fp.isUndefined(result) && translation) {
              return `${
                result ? result + ', ' : ''
              }${translation}${renderOpintojenLaajuus(
                opintojenLaajuusNumero,
                t,
                lng
              )}`;
            }
            return undefined;
          },
          translatedNimiAcc,
          allLinjatTranslations
        )
      )({ fi: null, sv: null, en: null }),
    [t, allLinjatTranslations, opintojenLaajuusNumero]
  );
};

export const LukiolinjatSection = ({ name, koulutus }) => {
  const { t } = useTranslation();

  const {
    data: koodistoDataKoulutustehtavat = [],
    isLoading: isLoadingKoulutustehtavat,
  } = useKoodisto({
    koodisto: 'lukiolinjaterityinenkoulutustehtava',
  });

  const {
    data: koodistoDataPainotukset = [],
    isLoading: isLoadingPainotukset,
  } = useKoodisto({
    koodisto: 'lukiopainotukset',
  });

  const yleislinjaFieldName = `${name}.yleislinja`;
  const yleislinjaSelected = useFieldValue(yleislinjaFieldName);

  const selectedPainotukset = useSelectedOsioLinjat(`${name}.painotukset`);
  const selectedKoulutustehtavat = useSelectedOsioLinjat(
    `${name}.erityisetKoulutustehtavat`
  );

  const isLoading = isLoadingPainotukset || isLoadingKoulutustehtavat;

  const selectedLinjatTranslations = useMemo(
    () =>
      isLoading
        ? []
        : [
            ..._fp.map(
              findTranslationsByKoodi(koodistoDataPainotukset),
              selectedPainotukset
            ),
            ..._fp.map(
              findTranslationsByKoodi(koodistoDataKoulutustehtavat),
              selectedKoulutustehtavat
            ),
          ],
    [
      isLoading,
      selectedPainotukset,
      koodistoDataPainotukset,
      selectedKoulutustehtavat,
      koodistoDataKoulutustehtavat,
    ]
  );

  const opintojenLaajuusKoodiUri = koulutus?.metadata?.opintojenLaajuusKoodiUri;

  const { koodiArvo: opintojenLaajuusNumero } = parseKoodiUri(
    opintojenLaajuusKoodiUri
  );

  const nimi = useLukioToteutusNimi({
    yleislinjaSelected,
    selectedLinjatTranslations,
    opintojenLaajuusNumero,
  });

  const linjaSelectionsEmpty =
    _fp.isEmpty(selectedPainotukset) && _fp.isEmpty(selectedKoulutustehtavat);

  console.log({ nimi });

  useSetFieldValue('tiedot.nimi', nimi);

  return (
    <>
      <Box mb={2}>
        <Field
          component={FormFieldSwitch}
          name={yleislinjaFieldName}
          disabled={linjaSelectionsEmpty}
        >
          {t('toteutuslomake.lukionYleislinja')}
        </Field>
      </Box>
      <LukiolinjaOsio
        name={`${name}.painotukset`}
        title={t('toteutuslomake.painotukset')}
        kuvausLabel={t('toteutuslomake.painotuksenKuvaus')}
        isKaytossaLabel={t('toteutuslomake.lukiollaOnPainotuksia')}
        valinnatLabel={t('toteutuslomake.valitsePainotukset')}
        koodistoData={koodistoDataPainotukset}
        {...getTestIdProps('painotukset')}
      />
      <Spacing marginBottom={8} />
      <LukiolinjaOsio
        name={`${name}.erityisetKoulutustehtavat`}
        title={t('toteutuslomake.erityisetKoulutustehtavat')}
        kuvausLabel={t('toteutuslomake.erityisenKoulutustehtavanKuvaus')}
        isKaytossaLabel={t(
          'toteutuslomake.lukiollaOnErityisiaKoulutustehtavia'
        )}
        valinnatLabel={t('toteutuslomake.valitseErityisetKoulutustehtavat')}
        koodistoData={koodistoDataKoulutustehtavat}
        {...getTestIdProps('erityisetKoulutustehtavat')}
      />
    </>
  );
};
