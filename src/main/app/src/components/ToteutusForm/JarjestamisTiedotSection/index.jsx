import React, { useMemo } from 'react';
import { Field } from 'redux-form';
import styled from 'styled-components';
import get from 'lodash/get';

import useTranslation from '../../useTranslation';
import Spacing from '../../Spacing';
import OpetusaikaCheckboxGroup from './OpetusaikaCheckboxGroup';
import OpetuskieliCheckboxGroup from './OpetuskieliCheckboxGroup';
import OpetustapaCheckboxGroup from './OpetustapaCheckboxGroup';
import Flex, { FlexItem } from '../../Flex';
import AlkamiskausiFields from './AlkamiskausiFields';
import useKoodistoOptions from '../../useKoodistoOptions';
import { isArray, getTestIdProps } from '../../../utils';
import NoYesRadioGroup from '../../NoYesRadioGroup';
import DividerHeading from '../../DividerHeading';
import MaksullisuusFields from './MaksullisuusFields';
import isKorkeakouluKoulutustyyppi from '../../../utils/isKorkeakouluKoulutustyyppi';
import useFieldValue from '../../useFieldValue';
import FormConfigField from '../../FormConfigField';
import DiplomiFields from './DiplomiFields';
import KielivalikoimaFields from './KielivalikoimaFields';

import {
  FormFieldTextarea,
  FormFieldSelect,
  FormFieldInput,
  createFormFieldComponent,
} from '../../formFields';

const makeCountLimitOnChange = (onChange, max) => items =>
  isArray(items) && items.length <= max && onChange(items);

const NoYesField = createFormFieldComponent(
  NoYesRadioGroup,
  ({ input, ...props }) => ({
    ...input,
    ...props,
  }),
);

const OpetusaikaField = createFormFieldComponent(
  OpetusaikaCheckboxGroup,
  ({ input: { value, onChange, ...input }, ...props }) => ({
    ...input,
    value: value || [],
    onChange: makeCountLimitOnChange(onChange, 2),
    ...props,
  }),
);

const OpetuskieliField = createFormFieldComponent(
  OpetuskieliCheckboxGroup,
  ({ input, ...props }) => ({
    ...input,
    ...props,
  }),
);

const OpetustapaField = createFormFieldComponent(
  OpetustapaCheckboxGroup,
  ({ input: { value, ...input }, ...props }) => ({
    ...input,
    value: value || [],
    ...props,
  }),
);

const OsiotFields = ({ language, osiotOptions, name }) => {
  const osiot = useFieldValue(`${name}.osiot`);
  const osiotArr = osiot || [];

  const osiotArrWithLabels = useMemo(() => {
    return osiotArr.map(({ value, label }) => ({
      value,
      label: label
        ? label
        : get(osiotOptions.find(({ value: v }) => v === value), 'label') ||
          null,
    }));
  }, [osiotArr, osiotOptions]);

  return osiotArrWithLabels.map(({ value, label }, index) => (
    <Spacing
      marginBottom={index !== osiot.length - 1 ? 2 : 0}
      key={value}
      {...getTestIdProps(`osioKuvaus.${value}`)}
    >
      <Field
        name={`${name}.osioKuvaukset.${value}.${language}`}
        component={FormFieldTextarea}
        label={label}
      />
    </Spacing>
  ));
};

const ExtraFieldWrapper = styled.div`
  max-width: 250px;
  width: 100%;
`;

const ExtraField = ({ children = null }) => (
  <ExtraFieldWrapper>{children}</ExtraFieldWrapper>
);

const StipendiFields = ({ language, name }) => {
  const { t } = useTranslation();
  const onkoStipendia = useFieldValue(`${name}.onkoStipendia`);

  return (
    <Flex {...getTestIdProps('stipendi')}>
      <FlexItem grow={0} basis="30%">
        <Field name={`${name}.onkoStipendia`} component={NoYesField} />
        {onkoStipendia ? (
          <Spacing marginTop={1} {...getTestIdProps('stipendinMaara')}>
            <ExtraField>
              <Field
                name={`${name}.stipendinMaara`}
                component={FormFieldInput}
                placeholder={t('yleiset.maara')}
                helperText="Euroa tai prosenttia"
              />
            </ExtraField>
          </Spacing>
        ) : null}
      </FlexItem>
      <FlexItem grow={1} paddingLeft={4}>
        <Field
          name={`${name}.stipendinKuvaus.${language}`}
          component={FormFieldTextarea}
          label={t('yleiset.tarkempiKuvaus')}
        />
      </FlexItem>
    </Flex>
  );
};

const JarjestamisTiedotContent = ({ language, koulutustyyppi, name }) => {
  const { t } = useTranslation();

  const { options: osiotOptions } = useKoodistoOptions({
    koodisto: 'koulutuksenlisatiedot',
  });

  const isKorkeakoulu = isKorkeakouluKoulutustyyppi(koulutustyyppi);

  return (
    <>
      <Spacing marginBottom={4}>
        <DividerHeading>{t('yleiset.opetuskieli')}</DividerHeading>
        <Flex {...getTestIdProps('opetuskieli')}>
          <FlexItem grow={0} basis="30%">
            <Field name={`${name}.opetuskieli`} component={OpetuskieliField} />
          </FlexItem>
          <FlexItem grow={1} paddingLeft={4}>
            <Field
              name={`${name}.opetuskieliKuvaus.${language}`}
              component={FormFieldTextarea}
              label={t('yleiset.tarkempiKuvaus')}
            />
          </FlexItem>
        </Flex>
      </Spacing>

      <Spacing marginBottom={4}>
        <DividerHeading>
          {t('toteutuslomake.paaasiallinenOpetusaika')}
        </DividerHeading>
        <Flex {...getTestIdProps('opetusaika')}>
          <FlexItem grow={0} basis="30%">
            <Field
              name={`${name}.opetusaika`}
              component={OpetusaikaField}
              helperText={t('yleiset.voitValitaEnintaan', { lukumaara: 2 })}
            />
          </FlexItem>
          <FlexItem grow={1} paddingLeft={4}>
            <Field
              name={`${name}.opetusaikaKuvaus.${language}`}
              component={FormFieldTextarea}
              label={t('yleiset.tarkempiKuvaus')}
            />
          </FlexItem>
        </Flex>
      </Spacing>

      <Spacing marginBottom={4}>
        <DividerHeading>
          {t('toteutuslomake.paaasiallinenOpetustapa')}
        </DividerHeading>
        <Flex {...getTestIdProps('opetustapa')}>
          <FlexItem grow={0} basis="30%">
            <Field name={`${name}.opetustapa`} component={OpetustapaField} />
          </FlexItem>
          <FlexItem grow={1} paddingLeft={4}>
            <Field
              name={`${name}.opetustapaKuvaus.${language}`}
              component={FormFieldTextarea}
              label={t('yleiset.tarkempiKuvaus')}
            />
          </FlexItem>
        </Flex>
      </Spacing>

      <Spacing marginBottom={4}>
        <DividerHeading>
          {t('toteutuslomake.onkoOpetusMaksullista')}
        </DividerHeading>
        <Flex {...getTestIdProps('maksullisuus')}>
          <FlexItem grow={0} basis="30%">
            <MaksullisuusFields
              isKorkeakoulu={isKorkeakoulu}
              name={`${name}.maksullisuus`}
              language={language}
            />
          </FlexItem>
          <FlexItem
            grow={1}
            paddingLeft={4}
            {...getTestIdProps('maksullisuusKuvaus')}
          >
            <Field
              name={`${name}.maksullisuusKuvaus.${language}`}
              component={FormFieldTextarea}
              label={t('yleiset.tarkempiKuvaus')}
            />
          </FlexItem>
        </Flex>
      </Spacing>

      <Spacing marginBottom={4}>
        <DividerHeading>
          {t('toteutuslomake.onkoStipenditKaytossa')}
        </DividerHeading>
        <StipendiFields language={language} name={name} />
      </Spacing>

      <Spacing marginBottom={4}>
        <DividerHeading>
          {t('toteutuslomake.koulutuksenAjankohta')}
        </DividerHeading>
        <AlkamiskausiFields name={name} />
      </Spacing>

      <FormConfigField name="kielivalikoima">
        <Spacing marginBottom={4}>
          <KielivalikoimaFields name={name} />
        </Spacing>
      </FormConfigField>

      <FormConfigField name="diplomi">
        <Spacing marginBottom={4}>
          <DiplomiFields name={name} language={language} />
        </Spacing>
      </FormConfigField>

      <Spacing marginBottom={4}>
        <DividerHeading>{t('yleiset.valitseLisattavaOsio')}</DividerHeading>
        <div {...getTestIdProps('osiotSelect')}>
          <Field
            name={`${name}.osiot`}
            component={FormFieldSelect}
            options={osiotOptions}
            isMulti
          />
        </div>
      </Spacing>
      <OsiotFields
        language={language}
        osiotOptions={osiotOptions}
        name={name}
      />
    </>
  );
};

const JarjestamisTiedotSection = ({ language, koulutustyyppi, name }) => {
  return (
    <JarjestamisTiedotContent
      language={language}
      koulutustyyppi={koulutustyyppi}
      name={name}
    />
  );
};

export default JarjestamisTiedotSection;
