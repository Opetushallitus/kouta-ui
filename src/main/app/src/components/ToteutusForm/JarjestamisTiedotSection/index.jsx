import React, { useMemo } from 'react';
import { Field } from 'redux-form';
import styled from 'styled-components';
import { get, isArray } from 'lodash';

import { useTranslation } from 'react-i18next';
import Spacing from '../../Spacing';
import OpetusaikaCheckboxGroup from './OpetusaikaCheckboxGroup';
import OpetuskieliCheckboxGroup from './OpetuskieliCheckboxGroup';
import OpetustapaCheckboxGroup from './OpetustapaCheckboxGroup';
import Flex, { FlexItem } from '../../Flex';
import InputIcon from '../../InputIcon';
import AlkamiskausiFields from './AlkamiskausiFields';
import useKoodistoOptions from '../../useKoodistoOptions';
import { getTestIdProps } from '../../../utils';
import NoYesRadioGroup from '../../NoYesRadioGroup';
import MaksullisuusFields from './MaksullisuusFields';
import isKorkeakouluKoulutustyyppi from '../../../utils/isKorkeakouluKoulutustyyppi';
import { useFieldValue } from '#/src/hooks/form';
import FormConfigFragment from '../../FormConfigFragment';
import DiplomiFields from './DiplomiFields';
import KielivalikoimaFields from './KielivalikoimaFields';
import FieldGroup from '#/src/components/FieldGroup';

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
  })
);

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
        : get(
            osiotOptions.find(({ value: v }) => v === value),
            'label'
          ) || null,
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
        {/* TODO: Use FormFieldRadioGroup instead of NoYesField */}
        <Field
          label={t('toteutuslomake.valitseKaytettavaApurahoitus')}
          name={`${name}.onkoStipendia`}
          component={NoYesField}
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
        {onkoStipendia ? (
          <Spacing marginTop={1} {...getTestIdProps('stipendinMaara')}>
            <ExtraField>
              <Field
                name={`${name}.stipendinMaara`}
                component={FormFieldInput}
                placeholder={t('yleiset.maara')}
                helperText="Euroa tai prosenttia"
                suffix={<InputIcon type="euro_symbol" />}
                type="number"
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
              component={FormFieldTextarea}
              label={t('yleiset.tarkempiKuvaus')}
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
              component={FormFieldTextarea}
              label={t('yleiset.tarkempiKuvaus')}
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
              component={FormFieldTextarea}
              label={t('yleiset.tarkempiKuvaus')}
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
              language={language}
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
              component={FormFieldTextarea}
              label={t('yleiset.tarkempiKuvaus')}
            />
          </FlexItem>
        </Flex>
      </FieldGroup>

      <FieldGroup
        name={`${name}.apurahaGroup`}
        title={t('toteutuslomake.apuraha')}
      >
        <StipendiFields language={language} name={name} />
      </FieldGroup>

      <FieldGroup title={t('toteutuslomake.koulutuksenAjankohta')}>
        <AlkamiskausiFields name={name} />
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
