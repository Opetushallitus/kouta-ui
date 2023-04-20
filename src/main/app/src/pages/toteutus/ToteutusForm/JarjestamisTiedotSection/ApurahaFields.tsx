import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FieldGroup } from '#/src/components/FieldGroup';
import {
  FormFieldSelect,
  FormFieldInput,
  FormFieldRadioGroup,
  FormFieldEditor,
  FormFieldSwitch,
  createFormFieldComponent,
} from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';
import { MaaraTyyppi, ApurahaYksikko, NDASH } from '#/src/constants';
import { useFieldValue } from '#/src/hooks/form';
import { getTestIdProps } from '#/src/utils';
import { isApurahaVisible } from '#/src/utils/toteutus/toteutusVisibilities';

const APURAHA_YKSIKKO_OPTIONS = [
  {
    label: '€',
    value: ApurahaYksikko.EURO,
  },
  {
    label: '%',
    value: ApurahaYksikko.PROSENTTI,
  },
];

const ApurahaYksikkoField = ({ name, disabled }) => {
  return (
    <Field
      name={name}
      component={FormFieldSelect}
      placeholder={null}
      isClearable={false}
      isSearchable={false}
      options={APURAHA_YKSIKKO_OPTIONS}
      disabled={disabled}
    />
  );
};

// Tämä on samankaltainen kuin OpintojenLaajuusFieldRange. Jos tulee lisää samanlaisia syötekenttiä, pitää pohtia
// yleiskäyttöisen komponentin luomista.
export const ApurahaMaaraFields = createFormFieldComponent(
  ({ section, disabled }) => {
    const { t } = useTranslation();
    const apurahaMaaraTyyppi = useFieldValue<MaaraTyyppi>(
      `${section}.apurahaMaaraTyyppi`
    );
    return (
      <Box marginTop={1} {...getTestIdProps('apurahaMaara')} width="200px">
        <legend>{t('toteutuslomake.syotaApurahanMaara')} *</legend>
        <Box mt={1}>
          <Field
            name={`${section}.apurahaMaaraTyyppi`}
            component={FormFieldRadioGroup}
            options={[
              {
                label: t('toteutuslomake.yksiArvo'),
                value: MaaraTyyppi.YKSI_ARVO,
              },
              {
                label: t('toteutuslomake.vaihteluvali'),
                value: MaaraTyyppi.VAIHTELUVALI,
              },
            ]}
            disabled={disabled}
          />
        </Box>
        <Box
          display="flex"
          mt={1}
          alignItems="center"
          justifyContent="space-between"
        >
          <Box flexBasis="60px" flexGrow={1} data-testid="apurahaMin">
            <Field
              name={`${section}.apurahaMin`}
              placeholder={
                apurahaMaaraTyyppi === MaaraTyyppi.YKSI_ARVO
                  ? t('toteutuslomake.maara')
                  : t('toteutuslomake.min')
              }
              component={FormFieldInput}
              type="number"
              disabled={disabled}
            />
          </Box>
          {apurahaMaaraTyyppi === MaaraTyyppi.VAIHTELUVALI && (
            <>
              <Box style={{ textAlign: 'center', width: '20px' }}>{NDASH}</Box>
              <Box flexBasis="60px" flexGrow={1}>
                <Field
                  name={`${section}.apurahaMax`}
                  placeholder={t('toteutuslomake.max')}
                  component={FormFieldInput}
                  type="number"
                  disabled={disabled}
                />
              </Box>
            </>
          )}
          <Box ml={1} style={{ width: '70px' }}>
            <ApurahaYksikkoField
              name={`${section}.apurahaYksikko`}
              disabled={disabled}
            />
          </Box>
        </Box>
      </Box>
    );
  }
);

export const ApurahaFields = ({ koulutustyyppi, language, name }) => {
  const { t } = useTranslation();
  const onkoApuraha = useFieldValue<boolean>(`${name}.onkoApuraha`);
  const maksullisuustyyppi = useFieldValue<string>(
    `${name}.maksullisuustyyppi`
  );

  const isVisible = isApurahaVisible(maksullisuustyyppi);

  if (!isVisible) {
    return null;
  }

  return (
    <FieldGroup title={t('toteutuslomake.apuraha')}>
      <Box display="flex" {...getTestIdProps('apuraha')}>
        <Box flexGrow={0} flexBasis="30%">
          <Field name={`${name}.onkoApuraha`} component={FormFieldSwitch}>
            {t('toteutuslomake.apurahaKaytossa')}
          </Field>
          {onkoApuraha && (
            <Field
              component={ApurahaMaaraFields}
              name={`${name}.apurahaGroup`}
              section={name}
            />
          )}
        </Box>
        {onkoApuraha && (
          <Box flexGrow={1} paddingLeft={4}>
            <Field
              name={`${name}.apurahaKuvaus.${language}`}
              component={FormFieldEditor}
              label={t('yleiset.tarkempiKuvaus')}
              hideHeaderSelect
            />
          </Box>
        )}
      </Box>
    </FieldGroup>
  );
};
