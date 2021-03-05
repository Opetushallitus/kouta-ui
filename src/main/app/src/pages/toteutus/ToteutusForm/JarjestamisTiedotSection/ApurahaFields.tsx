import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import FieldGroup from '#/src/components/FieldGroup';
import { Flex, FlexItem } from '#/src/components/Flex';
import {
  FormFieldSelect,
  FormFieldInput,
  FormFieldRadioGroup,
  FormFieldEditor,
  FormFieldSwitch,
  createFormFieldComponent,
} from '#/src/components/formFields';
import Spacing from '#/src/components/Spacing';
import { Box } from '#/src/components/virkailija';
import { ApurahaMaaraTyyppi, ApurahaYksikko, NDASH } from '#/src/constants';
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

export const ApurahaMaaraFields = createFormFieldComponent(
  ({ section, disabled }) => {
    const { t } = useTranslation();
    const apurahaMaaraTyyppi = useFieldValue<ApurahaMaaraTyyppi>(
      `${section}.apurahaMaaraTyyppi`
    );
    return (
      <Spacing marginTop={1} {...getTestIdProps('apurahaMaara')} width="200px">
        <legend>{t('toteutuslomake.syotaApurahanMaara')} *</legend>
        <Box mt={1}>
          <Field
            name={`${section}.apurahaMaaraTyyppi`}
            component={FormFieldRadioGroup}
            options={[
              {
                label: t('toteutuslomake.yksiArvo'),
                value: ApurahaMaaraTyyppi.YKSI_ARVO,
              },
              {
                label: t('toteutuslomake.vaihteluvali'),
                value: ApurahaMaaraTyyppi.VAIHTELUVALI,
              },
            ]}
            disabled={disabled}
          />
        </Box>
        <Flex mt={1} alignCenter justifyBetween>
          <FlexItem basis="60px" grow={1} data-testid="apurahaMin">
            <Field
              name={`${section}.apurahaMin`}
              placeholder={
                apurahaMaaraTyyppi === ApurahaMaaraTyyppi.YKSI_ARVO
                  ? t('toteutuslomake.maara')
                  : t('toteutuslomake.min')
              }
              component={FormFieldInput}
              type="number"
              disabled={disabled}
            />
          </FlexItem>
          {apurahaMaaraTyyppi === ApurahaMaaraTyyppi.VAIHTELUVALI && (
            <>
              <Box style={{ textAlign: 'center', width: '20px' }}>{NDASH}</Box>
              <FlexItem basis="60px" grow={1}>
                <Field
                  name={`${section}.apurahaMax`}
                  placeholder={t('toteutuslomake.max')}
                  component={FormFieldInput}
                  type="number"
                  disabled={disabled}
                />
              </FlexItem>
            </>
          )}
          <Box ml={1} style={{ width: '70px' }}>
            <ApurahaYksikkoField
              name={`${section}.apurahaYksikko`}
              disabled={disabled}
            />
          </Box>
        </Flex>
      </Spacing>
    );
  }
);

export const ApurahaFields = ({ koulutustyyppi, language, name }) => {
  const { t } = useTranslation();
  const onkoApuraha = useFieldValue<boolean>(`${name}.onkoApuraha`);

  const opetuskieliArr = useFieldValue<Array<string>>(`${name}.opetuskieli`);

  const isVisible = isApurahaVisible(koulutustyyppi, opetuskieliArr);

  if (!isVisible) {
    return null;
  }

  return (
    <FieldGroup title={t('toteutuslomake.apuraha')}>
      <Flex {...getTestIdProps('apuraha')}>
        <FlexItem grow={0} basis="30%">
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
        </FlexItem>
        <FlexItem grow={1} paddingLeft={4}>
          <Field
            name={`${name}.apurahaKuvaus.${language}`}
            component={FormFieldEditor}
            label={t('yleiset.tarkempiKuvaus')}
            hideHeaderSelect
          />
        </FlexItem>
      </Flex>
    </FieldGroup>
  );
};
