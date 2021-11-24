import React, { useEffect, useMemo } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FieldGroup } from '#/src/components/FieldGroup';
import { FormFieldEditor, FormFieldSwitch } from '#/src/components/formFields';
import { KoodistoCollapseList } from '#/src/components/KoodistoCollapseList';
import { Box } from '#/src/components/virkailija';
import { useLanguageTab } from '#/src/contexts/LanguageTabContext';
import {
  useBoundFormActions,
  useFieldValue,
  useIsDirty,
} from '#/src/hooks/form';
import { useKoodisto } from '#/src/hooks/useKoodisto';
import { getTestIdProps } from '#/src/utils';

const LukiolinjaKuvaus = ({ koodiUri, name, itemProps }) => {
  const languageTab = useLanguageTab();

  return (
    <Field
      component={FormFieldEditor}
      label={itemProps?.kuvausLabel}
      name={`${name}.kuvaukset.${koodiUri}.${languageTab}`}
    />
  );
};

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

const useSelectedOsioLinjat = osioFieldName => {
  const osioKaytossa = useFieldValue(`${osioFieldName}.kaytossa`);
  const selectedValinnat = useFieldValue(`${osioFieldName}.valinnat`);
  return useMemo(
    () => (osioKaytossa ? selectedValinnat : []),
    [osioKaytossa, selectedValinnat]
  );
};

export const LukiolinjatSection = ({ name }) => {
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

  const selectedPainotukset = useSelectedOsioLinjat(`${name}.painotukset`);
  const selectedKoulutustehtavat = useSelectedOsioLinjat(
    `${name}.erityisetKoulutustehtavat`
  );

  const isLoading = isLoadingPainotukset || isLoadingKoulutustehtavat;

  const linjaSelectionsEmpty =
    _fp.isEmpty(selectedPainotukset) && _fp.isEmpty(selectedKoulutustehtavat);

  const { change } = useBoundFormActions();
  const isDirty = useIsDirty();

  useEffect(() => {
    if (isDirty && !isLoading && linjaSelectionsEmpty) {
      change(yleislinjaFieldName, true);
    }
  }, [change, isDirty, isLoading, linjaSelectionsEmpty, yleislinjaFieldName]);

  return (
    <>
      <Box mb={2}>
        <Field
          component={FormFieldSwitch}
          name={yleislinjaFieldName}
          disabled={linjaSelectionsEmpty}
          helperText={
            linjaSelectionsEmpty
              ? t('toteutuslomake.lukionYleislinjaOhjeteksti')
              : ''
          }
        >
          {t('toteutuslomake.lukionYleislinjaValinta')}
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
      <Box marginBottom={8} />
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
