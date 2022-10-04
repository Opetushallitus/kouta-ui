import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { Field, FieldArray } from 'redux-form';

import { FieldGroup } from '#/src/components/FieldGroup';
import {
  FormFieldEditor,
  FormFieldRadioGroup,
  FormFieldInput,
} from '#/src/components/formFields';
import { Box, Spin } from '#/src/components/virkailija';
import { useFieldValue, useSetFieldValue } from '#/src/hooks/form';
import { useLukiolinjaKoodit } from '#/src/hooks/useLukiolinjaKoodit';
import { ToteutusModel } from '#/src/types/toteutusTypes';
import { getTestIdProps } from '#/src/utils';
import { getLanguageValue } from '#/src/utils/languageUtils';

import PainotetutArvosanatFields from './PainotetutArvosanatFields';

type Props = {
  name: TranslatedField;
  language: LanguageCode;
  toteutus: ToteutusModel;
  nimiFieldPath: string;
};

export const HakukohteenLinjaSection = ({
  name,
  language,
  toteutus,
  nimiFieldPath,
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
