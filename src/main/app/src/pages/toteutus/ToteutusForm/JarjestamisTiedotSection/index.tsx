import React, { useMemo } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import FieldGroup from '#/src/components/FieldGroup';
import { Flex, FlexItem } from '#/src/components/Flex';
import FormConfigFragment from '#/src/components/FormConfigFragment';
import {
  FormFieldSelect,
  FormFieldInput,
  createFormFieldComponent,
  FormFieldRadioGroup,
  FormFieldEditor,
} from '#/src/components/formFields';
import { KoulutuksenAloitusajankohtaFields } from '#/src/components/KoulutuksenAloitusajankohtaFields';
import Spacing from '#/src/components/Spacing';
import { Box, FormLabel } from '#/src/components/virkailija';
import {
  ApurahaMaaraTyyppi,
  ApurahaTyyppi,
  ApurahaYksikko,
  NDASH,
} from '#/src/constants';
import { useFieldValue } from '#/src/hooks/form';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import { getTestIdProps } from '#/src/utils';
import isKorkeakouluKoulutustyyppi from '#/src/utils/koulutus/isKorkeakouluKoulutustyyppi';
import { isApurahaVisible } from '#/src/utils/toteutus/toteutusVisibilities';

import { DiplomiFields } from './DiplomiFields';
import KielivalikoimaFields from './KielivalikoimaFields';
import MaksullisuusFields from './MaksullisuusFields';
import OpetusaikaCheckboxGroup from './OpetusaikaCheckboxGroup';
import OpetuskieliCheckboxGroup from './OpetuskieliCheckboxGroup';
import OpetustapaCheckboxGroup from './OpetustapaCheckboxGroup';

const makeCountLimitOnChange = (onChange, max) => items =>
  _fp.isArray(items) && items.length <= max && onChange(items);

const OpetusaikaField = createFormFieldComponent(
  OpetusaikaCheckboxGroup,
  ({ input: { value, onChange, ...input }, ...props }) => ({
    ...input,
    value: value || [],
    onChange: makeCountLimitOnChange(onChange, 2),
    ...props,
  })
);

const OpetuskieliField = createFormFieldComponent(
  OpetuskieliCheckboxGroup,
  ({ input, ...props }) => ({
    ...input,
    ...props,
  })
);

const OpetustapaField = createFormFieldComponent(
  OpetustapaCheckboxGroup,
  ({ input: { value, ...input }, ...props }) => ({
    ...input,
    value: value || [],
    ...props,
  })
);

const OsiotFields = ({ language, osiotOptions, name }) => {
  const osiot = useFieldValue(`${name}.osiot`);

  const osiotArrWithLabels = useMemo(() => {
    return (osiot || []).map(({ value, label }) => ({
      value,
      label: label
        ? label
        : _fp.get(
            'label',
            osiotOptions.find(({ value: v }) => v === value)
          ) || null, // TODO: Use something else than null as a label, when not found
    }));
  }, [osiot, osiotOptions]);

  return (
    <>
      {osiotArrWithLabels.map(({ value, label }, index) => (
        <Spacing
          marginBottom={index !== osiot.length - 1 ? 2 : 0}
          key={value}
          {...getTestIdProps(`osioKuvaus.${value}`)}
        >
          <Field
            name={`${name}.osioKuvaukset.${value}.${language}`}
            component={FormFieldEditor}
            label={label}
          />
        </Spacing>
      ))}
    </>
  );
};

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

const ApurahaFields = ({ koulutustyyppi, language, name }) => {
  const { t } = useTranslation();
  const apurahaValue = useFieldValue<ApurahaTyyppi>(`${name}.apurahaTyyppi`);
  const apurahaMaaraTyyppi = useFieldValue<ApurahaTyyppi>(
    `${name}.apurahaMaaraTyyppi`
  );
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
                    placeholder="Min"
                    component={FormFieldInput}
                    type="number"
                  />
                </FlexItem>
                {apurahaMaaraTyyppi?.value ===
                  ApurahaMaaraTyyppi.VAIHTELUVALI && (
                  <>
                    <Box style={{ textAlign: 'center', width: '20px' }}>
                      {NDASH}
                    </Box>
                    <FlexItem basis="60px" grow={1}>
                      <Field
                        name={`${name}.apurahaMax`}
                        placeholder="Max"
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

const SuunniteltuKestoFields = ({ name }) => {
  const { t } = useTranslation();
  return (
    <FieldGroup
      name={`${name}.suunniteltuKesto`}
      title="Opintojen suunniteltu kesto"
      HeadingComponent={FormLabel}
    >
      <Flex>
        <FlexItem>
          <Field
            name={`${name}.suunniteltuKesto.vuotta`}
            component={FormFieldInput}
            placeholder={t('toteutuslomake.vuotta')}
            type="number"
            {...getTestIdProps('suunniteltuKestoVuotta')}
          />
        </FlexItem>
        <FlexItem ml={2}>
          <Field
            name={`${name}.suunniteltuKesto.kuukautta`}
            component={FormFieldInput}
            placeholder={t('toteutuslomake.kuukautta')}
            type="number"
            {...getTestIdProps('suunniteltuKestoKuukautta')}
          />
        </FlexItem>
      </Flex>
    </FieldGroup>
  );
};

export const JarjestamisTiedotSection = ({
  language,
  koulutustyyppi,
  name,
}) => {
  const { t } = useTranslation();

  const { options: osiotOptions } = useKoodistoOptions({
    koodisto: 'koulutuksenlisatiedot',
  });

  const isKorkeakoulu = isKorkeakouluKoulutustyyppi(koulutustyyppi);

  return (
    <>
      <FieldGroup title={t('yleiset.opetuskieli')}>
        <Flex {...getTestIdProps('opetuskieli')}>
          <FlexItem grow={0} basis="30%">
            <Field
              name={`${name}.opetuskieli`}
              component={OpetuskieliField}
              label={t('toteutuslomake.valitsePaaasiallinenOpetuskieli')}
            />
          </FlexItem>
          <FlexItem grow={1} paddingLeft={4}>
            <Field
              name={`${name}.opetuskieliKuvaus.${language}`}
              component={FormFieldEditor}
              label={t('yleiset.tarkempiKuvaus')}
              hideHeaderSelect
            />
          </FlexItem>
        </Flex>
      </FieldGroup>
      <FieldGroup title={t('toteutuslomake.suunniteltuKesto')}>
        <Flex {...getTestIdProps('suunniteltuKesto')}>
          <FlexItem grow={0} basis="30%">
            <SuunniteltuKestoFields name={name} />
          </FlexItem>
          <FlexItem grow={1} paddingLeft={4}>
            <Field
              name={`${name}.suunniteltuKestoKuvaus.${language}`}
              component={FormFieldEditor}
              label={t('yleiset.tarkempiKuvaus')}
              hideHeaderSelect
              {...getTestIdProps('suunniteltuKestoKuvaus')}
            />
          </FlexItem>
        </Flex>
      </FieldGroup>

      <FieldGroup title={t('toteutuslomake.opetusaika')}>
        <Flex {...getTestIdProps('opetusaika')}>
          <FlexItem grow={0} basis="30%">
            <Field
              name={`${name}.opetusaika`}
              component={OpetusaikaField}
              label={t('toteutuslomake.valitsePaaasiallinenOpetusaika')}
              helperText={t('yleiset.voitValitaEnintaan', { lukumaara: 2 })}
            />
          </FlexItem>
          <FlexItem grow={1} paddingLeft={4}>
            <Field
              name={`${name}.opetusaikaKuvaus.${language}`}
              component={FormFieldEditor}
              label={t('yleiset.tarkempiKuvaus')}
              hideHeaderSelect
            />
          </FlexItem>
        </Flex>
      </FieldGroup>

      <FieldGroup title={t('toteutuslomake.paaasiallinenOpetustapa')}>
        <Flex {...getTestIdProps('opetustapa')}>
          <FlexItem grow={0} basis="30%">
            <Field
              name={`${name}.opetustapa`}
              component={OpetustapaField}
              label={t('toteutuslomake.valitsePaaasiallinenOpetustapa')}
            />
          </FlexItem>
          <FlexItem grow={1} paddingLeft={4}>
            <Field
              name={`${name}.opetustapaKuvaus.${language}`}
              component={FormFieldEditor}
              label={t('yleiset.tarkempiKuvaus')}
              hideHeaderSelect
            />
          </FlexItem>
        </Flex>
      </FieldGroup>

      <FieldGroup title={t('toteutuslomake.opetuksenMaksullisuus')}>
        <Flex {...getTestIdProps('maksullisuus')}>
          <FlexItem grow={0} basis="30%">
            <MaksullisuusFields
              isKorkeakoulu={isKorkeakoulu}
              name={`${name}.maksullisuus`}
              label={t('toteutuslomake.onkoOpetusMaksullista')}
            />
          </FlexItem>
          <FlexItem
            grow={1}
            paddingLeft={4}
            {...getTestIdProps('maksullisuusKuvaus')}
          >
            <Field
              name={`${name}.maksullisuusKuvaus.${language}`}
              component={FormFieldEditor}
              label={t('yleiset.tarkempiKuvaus')}
              hideHeaderSelect
            />
          </FlexItem>
        </Flex>
      </FieldGroup>

      {/* StipendiFields contains conditional rendering -> FieldGroup moved there */}
      <ApurahaFields
        language={language}
        name={name}
        koulutustyyppi={koulutustyyppi}
      />

      <FieldGroup title={t('yleiset.koulutuksenAjankohta')}>
        <KoulutuksenAloitusajankohtaFields
          section={`${name}.ajankohta`}
          name={`${name}.ajankohta.ajankohtaTyyppi`}
          language={language}
        />
      </FieldGroup>

      <FormConfigFragment name="kielivalikoima">
        <Spacing marginBottom={4}>
          <KielivalikoimaFields name={name} />
        </Spacing>
      </FormConfigFragment>

      <FormConfigFragment name="diplomi">
        <Spacing marginBottom={4}>
          <DiplomiFields name={name} language={language} />
        </Spacing>
      </FormConfigFragment>

      <FieldGroup title={t('yleiset.valitseLisattavaOsio')}>
        <div {...getTestIdProps('osiotSelect')}>
          <Field
            name={`${name}.osiot`}
            component={FormFieldSelect}
            options={osiotOptions}
            isMulti
          />
        </div>
      </FieldGroup>

      <OsiotFields
        language={language}
        osiotOptions={osiotOptions}
        name={name}
      />
    </>
  );
};
