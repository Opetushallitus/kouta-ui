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
} from '#/src/components/formFields';
import Spacing from '#/src/components/Spacing';
import { Box } from '#/src/components/virkailija';
import {
  ApurahaMaaraTyyppi,
  ApurahaTyyppi,
  ApurahaYksikko,
  NDASH,
} from '#/src/constants';
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

const ApurahaYksikkoField = ({ name }) => {
  return (
    <Field
      name={name}
      component={FormFieldSelect}
      placeholder={null}
      isClearable={false}
      isSearchable={false}
      options={APURAHA_YKSIKKO_OPTIONS}
    />
  );
};

export const ApurahaFields = ({ koulutustyyppi, language, name }) => {
  const { t } = useTranslation();
  const apurahaValue = useFieldValue<ApurahaTyyppi>(`${name}.apurahaTyyppi`);
  const apurahaMaaraTyyppi = useFieldValue<SelectOption<ApurahaMaaraTyyppi>>(
    `${name}.apurahaMaaraTyyppi`
  )?.value;

  const opetuskieliArr = useFieldValue<Array<string>>(`${name}.opetuskieli`);

  const isVisible = isApurahaVisible(koulutustyyppi, opetuskieliArr);

  if (!isVisible) {
    return null;
  }

  return (
    <FieldGroup title={t('toteutuslomake.apuraha')}>
      <Flex {...getTestIdProps('apuraha')}>
        <FlexItem grow={0} basis="30%">
          <Field
            label={t('toteutuslomake.valitseKaytettavaApurahoitus')}
            name={`${name}.apurahaTyyppi`}
            component={FormFieldRadioGroup}
            options={[
              {
                label: t('toteutuslomake.eiKaytossa'),
                value: ApurahaTyyppi.EI_KAYTOSSA,
              },
              {
                label: t('toteutuslomake.apuraha'),
                value: ApurahaTyyppi.APURAHA,
              },
              {
                label: t('toteutuslomake.koulutussetelit'),
                value: ApurahaTyyppi.KOULUTUSSETELI,
              },
            ]}
          />
          {apurahaValue && apurahaValue !== ApurahaTyyppi.EI_KAYTOSSA && (
            <Spacing
              marginTop={1}
              {...getTestIdProps('apurahaMaara')}
              width="200px"
            >
              <legend>{t('toteutuslomake.syotaApurahanMaara')} *</legend>
              <Box mt={1}>
                <Field
                  name={`${name}.apurahaMaaraTyyppi`}
                  component={FormFieldSelect}
                  isClearable={false}
                  isSearchable={false}
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
                />
              </Box>
              <Flex mt={1} alignCenter justifyBetween>
                <FlexItem basis="60px" grow={1} data-testid="apurahaMin">
                  <Field
                    name={`${name}.apurahaMin`}
                    placeholder={
                      apurahaMaaraTyyppi === ApurahaMaaraTyyppi.YKSI_ARVO
                        ? t('toteutuslomake.maara')
                        : t('toteutuslomake.min')
                    }
                    component={FormFieldInput}
                    type="number"
                  />
                </FlexItem>
                {apurahaMaaraTyyppi === ApurahaMaaraTyyppi.VAIHTELUVALI && (
                  <>
                    <Box style={{ textAlign: 'center', width: '20px' }}>
                      {NDASH}
                    </Box>
                    <FlexItem basis="60px" grow={1}>
                      <Field
                        name={`${name}.apurahaMax`}
                        placeholder={t('toteutuslomake.max')}
                        component={FormFieldInput}
                        type="number"
                      />
                    </FlexItem>
                  </>
                )}
                <Box ml={1} style={{ width: '70px' }}>
                  <ApurahaYksikkoField name={`${name}.apurahaYksikko`} />
                </Box>
              </Flex>
            </Spacing>
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
