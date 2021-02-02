import React, { useMemo } from 'react';
import { Field } from 'redux-form';
import styled from 'styled-components';
import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import Spacing from '#/src/components/Spacing';
import Flex, { FlexItem } from '#/src/components/Flex';
import { FormLabel, InputIcon } from '#/src/components/virkailija';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import { getTestIdProps } from '#/src/utils';
import isKorkeakouluKoulutustyyppi from '#/src/utils/koulutus/isKorkeakouluKoulutustyyppi';
import { useFieldValue } from '#/src/hooks/form';
import FormConfigFragment from '#/src/components/FormConfigFragment';
import FieldGroup from '#/src/components/FieldGroup';
import {
  FormFieldSelect,
  FormFieldInput,
  createFormFieldComponent,
  FormFieldRadioGroup,
  FormFieldEditor,
} from '#/src/components/formFields';
import { isStipendiVisible } from '#/src/utils/toteutus/toteutusVisibilities';
import { KoulutuksenAloitusajankohtaFields } from '#/src/components/KoulutuksenAloitusajankohtaFields';

import MaksullisuusFields from './MaksullisuusFields';
import { DiplomiFields } from './DiplomiFields';
import KielivalikoimaFields from './KielivalikoimaFields';
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
  const osiotArr = osiot || [];

  const osiotArrWithLabels = useMemo(() => {
    return osiotArr.map(({ value, label }) => ({
      value,
      label: label
        ? label
        : _fp.get(
            'label',
            osiotOptions.find(({ value: v }) => v === value)
          ) || null, // TODO: Use something else than null as a label, when not found
    }));
  }, [osiotArr, osiotOptions]);

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

const ExtraFieldWrapper = styled.div`
  max-width: 250px;
  width: 100%;
`;

const ExtraField = ({ children = null }: { children: JSX.Element | null }) => (
  <ExtraFieldWrapper>{children}</ExtraFieldWrapper>
);

const StipendiFields = ({ koulutustyyppi, language, name }) => {
  const { t } = useTranslation();
  const onkoStipendia = useFieldValue<'kylla' | 'ei'>(`${name}.onkoStipendia`);
  const opetuskieliArr = useFieldValue<string[]>(`${name}.opetuskieli`);

  const isVisible = isStipendiVisible(koulutustyyppi, opetuskieliArr);

  if (!isVisible) {
    return null;
  }

  return (
    <FieldGroup
      name={`${name}.apurahaGroup`}
      title={t('toteutuslomake.apuraha')}
    >
      <Flex {...getTestIdProps('stipendi')}>
        <FlexItem grow={0} basis="30%">
          <Field
            label={t('toteutuslomake.valitseKaytettavaApurahoitus')}
            name={`${name}.onkoStipendia`}
            component={FormFieldRadioGroup}
            options={[
              {
                label: t('toteutuslomake.stipendi'),
                value: 'kylla',
              },
              {
                label: t('toteutuslomake.eiKaytossa'),
                value: 'ei',
              },
            ]}
          />
          {onkoStipendia === 'kylla' && (
            <Spacing marginTop={1} {...getTestIdProps('stipendinMaara')}>
              <ExtraField>
                <Field
                  name={`${name}.stipendinMaara`}
                  component={FormFieldInput}
                  placeholder={t('yleiset.maara')}
                  helperText={t('toteutuslomake.stipendinMaaraHelperText')}
                  suffix={<InputIcon type="euro_symbol" />}
                  type="number"
                />
              </ExtraField>
            </Spacing>
          )}
        </FlexItem>
        <FlexItem grow={1} paddingLeft={4}>
          <Field
            name={`${name}.stipendinKuvaus.${language}`}
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
      <StipendiFields
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
