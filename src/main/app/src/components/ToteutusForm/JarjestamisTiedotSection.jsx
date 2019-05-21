import React, { useMemo } from 'react';
import { Field, formValues } from 'redux-form';
import styled from 'styled-components';
import get from 'lodash/get';
import useTranslation from '../useTranslation';

import Spacing from '../Spacing';
import OpetusaikaCheckboxGroup from './OpetusaikaCheckboxGroup';
import OpetuskieliCheckboxGroup from './OpetuskieliCheckboxGroup';
import OpetustapaCheckboxGroup from './OpetustapaCheckboxGroup';
import Flex, { FlexItem } from '../Flex';
import AlkamiskausiFields from './AlkamiskausiFields';
import { KORKEAKOULUKOULUTUSTYYPIT } from '../../constants';
import useKoodistoOptions from '../useKoodistoOptions';
import { isArray, getTestIdProps } from '../../utils';
import NoYesRadioGroup from '../NoYesRadioGroup';
import DividerHeading from '../DividerHeading';
import MaksullisuusFields from './MaksullisuusFields';

import {
  FormFieldTextarea,
  FormFieldSelect,
  FormFieldInput,
  createFormFieldComponent,
} from '../FormFields';

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
  ({ input: { value, onChange, ...input }, ...props }) => ({
    ...input,
    value: value || [],
    onChange: makeCountLimitOnChange(onChange, 2),
    ...props,
  }),
);

const OsiotFieldsBase = ({ osiot, language, osiotOptions }) => {
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
        name={`osioKuvaukset.${value}.${language}`}
        component={FormFieldTextarea}
        label={label}
      />
    </Spacing>
  ));
};

const OsiotFields = formValues({ osiot: 'osiot' })(OsiotFieldsBase);

const WithOnkoStipendia = formValues({
  onkoStipendia: 'onkoStipendia',
})(({ children, ...rest }) => children(rest));

const ExtraFieldWrapper = styled.div`
  max-width: 250px;
  width: 100%;
`;

const ExtraField = ({ label = null, children = null }) => (
  <ExtraFieldWrapper>{children}</ExtraFieldWrapper>
);

const StipendiFields = ({ language }) => {
  const { t } = useTranslation();

  return (
    <Flex {...getTestIdProps('stipendi')}>
      <FlexItem grow={0} basis="30%">
        <Field name="onkoStipendia" component={NoYesField} />
        <WithOnkoStipendia>
          {({ onkoStipendia }) =>
            onkoStipendia ? (
              <Spacing marginTop={1} {...getTestIdProps('stipendinMaara')}>
                <ExtraField>
                  <Field
                    name={`stipendinMaara.${language}`}
                    component={FormFieldInput}
                    placeholder={t('yleiset.maara')}
                    helperText="Euroa tai prosenttia"
                  />
                </ExtraField>
              </Spacing>
            ) : null
          }
        </WithOnkoStipendia>
      </FlexItem>
      <FlexItem grow={1} paddingLeft={4}>
        <Field
          name={`stipendinKuvaus.${language}`}
          component={FormFieldTextarea}
          label={t('yleiset.tarkempiKuvaus')}
        />
      </FlexItem>
    </Flex>
  );
};

const JarjestamisTiedotContent = ({ language, koulutustyyppi }) => {
  const { t } = useTranslation();

  const { options: osiotOptions } = useKoodistoOptions({
    koodisto: 'koulutuksenlisatiedot',
  });

  const isKorkeakoulu = KORKEAKOULUKOULUTUSTYYPIT.includes(koulutustyyppi);

  return (
    <>
      <Spacing marginBottom={4}>
        <DividerHeading>{t('yleiset.opetuskieli')}</DividerHeading>
        <Flex {...getTestIdProps('opetuskieli')}>
          <FlexItem grow={0} basis="30%">
            <Field name="opetuskieli" component={OpetuskieliField} />
          </FlexItem>
          <FlexItem grow={1} paddingLeft={4}>
            <Field
              name={`opetuskieliKuvaus.${language}`}
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
              name="opetusaika"
              component={OpetusaikaField}
              helperText={t('yleiset.voitValitaEnintaan', { lukumaara: 2 })}
            />
          </FlexItem>
          <FlexItem grow={1} paddingLeft={4}>
            <Field
              name={`opetusaikaKuvaus.${language}`}
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
            <Field
              name="opetustapa"
              component={OpetustapaField}
              helperText={t('yleiset.voitValitaEnintaan', { lukumaara: 2 })}
            />
          </FlexItem>
          <FlexItem grow={1} paddingLeft={4}>
            <Field
              name={`opetustapaKuvaus.${language}`}
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
              name="maksullisuus"
              language={language}
            />
          </FlexItem>
          <FlexItem
            grow={1}
            paddingLeft={4}
            {...getTestIdProps('maksullisuusKuvaus')}
          >
            <Field
              name={`maksullisuusKuvaus.${language}`}
              component={FormFieldTextarea}
              label={t('yleiset.tarkempiKuvaus')}
            />
          </FlexItem>
        </Flex>
      </Spacing>
      {isKorkeakoulu ? (
        <Spacing marginBottom={4}>
          <DividerHeading>
            {t('toteutuslomake.onkoStipenditKaytossa')}
          </DividerHeading>
          <StipendiFields language={language} />
        </Spacing>
      ) : null}
      <Spacing marginBottom={4}>
        <DividerHeading>
          {t('toteutuslomake.koulutuksenAlkamiskausi')}
        </DividerHeading>
        <Flex {...getTestIdProps('alkamiskausi')}>
          <FlexItem grow={0} basis="30%">
            <AlkamiskausiFields name="alkamiskausi" />
          </FlexItem>
          <FlexItem grow={1} paddingLeft={4}>
            <Field
              name={`alkamiskausiKuvaus.${language}`}
              component={FormFieldTextarea}
              label={t('yleiset.tarkempiKuvaus')}
            />
          </FlexItem>
        </Flex>
      </Spacing>
      <Spacing marginBottom={4}>
        <DividerHeading>{t('yleiset.valitseLisattavaOsio')}</DividerHeading>
        <div {...getTestIdProps('osiotSelect')}>
          <Field
            name="osiot"
            component={FormFieldSelect}
            options={osiotOptions}
            isMulti
          />
        </div>
      </Spacing>
      <OsiotFields language={language} osiotOptions={osiotOptions} />
    </>
  );
};

const JarjestamisTiedotSection = ({ language, koulutustyyppi }) => {
  return (
    <JarjestamisTiedotContent
      language={language}
      koulutustyyppi={koulutustyyppi}
    />
  );
};

export default JarjestamisTiedotSection;
