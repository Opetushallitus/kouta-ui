import React, { useMemo } from 'react';
import { Field, formValues } from 'redux-form';
import styled from 'styled-components';
import get from 'lodash/get';
import useTranslation from '../useTranslation';

import Spacing from '../Spacing';
import Typography from '../Typography';
import OpetusaikaRadioGroup from './OpetusaikaRadioGroup';
import OpetuskieliCheckboxGroup from './OpetuskieliCheckboxGroup';
import OpetustapaCheckboxGroup from './OpetustapaCheckboxGroup';
import Flex, { FlexItem } from '../Flex';
import AlkamiskausiFields from './AlkamiskausiFields';
import { KORKEAKOULUKOULUTUSTYYPIT } from '../../constants';
import useKoodistoOptions from '../useKoodistoOptions';
import { isArray, getTestIdProps } from '../../utils';
import NoYesRadioGroup from '../NoYesRadioGroup';

import {
  FormFieldTextarea,
  FormFieldSelect,
  FormFieldInput,
  createFormFieldComponent,
} from '../FormFields';

const NoYesField = createFormFieldComponent(
  NoYesRadioGroup,
  ({ input, ...props }) => ({
    ...input,
    ...props,
  }),
);

const OpetusaikaField = createFormFieldComponent(
  OpetusaikaRadioGroup,
  ({ input, ...props }) => ({
    ...input,
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
    onChange: items => isArray(items) && items.length <= 2 && onChange(items),
    ...props,
  }),
);

const BorderHeading = styled(Typography).attrs({
  variant: 'h6',
  paddingBottom: 1,
  marginBottom: 2,
})`
  border-bottom: 1px solid ${({ theme }) => theme.palette.border};
`;

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

const WithOnkoLukuvuosimaksua = formValues({
  onkoLukuvuosimaksua: 'onkoLukuvuosimaksua',
})(({ children, ...rest }) => children(rest));

const WithOnkoStipendia = formValues({
  onkoStipendia: 'onkoStipendia',
})(({ children, ...rest }) => children(rest));

const MaksullisuusFieldValue = formValues({
  maksullisuus: 'maksullisuus',
})(({ children, ...rest }) => children(rest));

const ExtraFieldWrapper = styled.div`
  max-width: 250px;
  width: 100%;
`;

const ExtraField = ({ label = null, children = null }) => (
  <ExtraFieldWrapper>{children}</ExtraFieldWrapper>
);

const LukuvuosimaksuFields = ({ language }) => {
  const { t } = useTranslation();

  return (
    <Flex {...getTestIdProps('lukuvuosimaksu')}>
      <FlexItem grow={0} basis="30%">
        <Field name="onkoLukuvuosimaksua" component={NoYesField} />
        <WithOnkoLukuvuosimaksua>
          {({ onkoLukuvuosimaksua }) =>
            onkoLukuvuosimaksua ? (
              <Spacing
                marginTop={1}
                {...getTestIdProps('lukuvuosimaksunMaara')}
              >
                <ExtraField>
                  <Field
                    name={`lukuvuosimaksu.${language}`}
                    component={FormFieldInput}
                    placeholder={t('yleiset.maara')}
                    helperText={t('yleiset.euroa')}
                  />
                </ExtraField>
              </Spacing>
            ) : null
          }
        </WithOnkoLukuvuosimaksua>
      </FlexItem>
      <FlexItem grow={1} paddingLeft={3}>
        <Field
          name={`lukuvuosimaksuKuvaus.${language}`}
          component={FormFieldTextarea}
          label={t('yleiset.tarkempiKuvaus')}
        />
      </FlexItem>
    </Flex>
  );
};

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
      <FlexItem grow={1} paddingLeft={3}>
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
    koodisto: 'koulutuksenjarjestamisenlisaosiot',
  });

  const isKorkeakoulu = KORKEAKOULUKOULUTUSTYYPIT.includes(koulutustyyppi);

  return (
    <>
      <Spacing marginBottom={2}>
        <BorderHeading>{t('yleiset.opetuskieli')}</BorderHeading>
        <Flex {...getTestIdProps('opetuskieli')}>
          <FlexItem grow={0} basis="30%">
            <Field name="opetuskieli" component={OpetuskieliField} />
          </FlexItem>
          <FlexItem grow={1} paddingLeft={3}>
            <Field
              name={`opetuskieliKuvaus.${language}`}
              component={FormFieldTextarea}
              label={t('yleiset.tarkempiKuvaus')}
            />
          </FlexItem>
        </Flex>
      </Spacing>
      <Spacing marginBottom={2}>
        <BorderHeading>
          {t('toteutuslomake.paaasiallinenOpetusaika')}
        </BorderHeading>
        <Flex {...getTestIdProps('opetusaika')}>
          <FlexItem grow={0} basis="30%">
            <Field name="opetusaika" component={OpetusaikaField} />
          </FlexItem>
          <FlexItem grow={1} paddingLeft={3}>
            <Field
              name={`opetusaikaKuvaus.${language}`}
              component={FormFieldTextarea}
              label={t('yleiset.tarkempiKuvaus')}
            />
          </FlexItem>
        </Flex>
      </Spacing>
      <Spacing marginBottom={2}>
        <BorderHeading>
          {t('toteutuslomake.paaasiallinenOpetustapa')}
        </BorderHeading>
        <Flex {...getTestIdProps('opetustapa')}>
          <FlexItem grow={0} basis="30%">
            <Field name="opetustapa" component={OpetustapaField} />
            <Typography variant="secondary" as="div" marginTop={1}>
              {t('yleiset.voitValitaEnintaan', { lukumaara: 2 })}
            </Typography>
          </FlexItem>
          <FlexItem grow={1} paddingLeft={3}>
            <Field
              name={`opetustapaKuvaus.${language}`}
              component={FormFieldTextarea}
              label={t('yleiset.tarkempiKuvaus')}
            />
          </FlexItem>
        </Flex>
      </Spacing>
      <Spacing marginBottom={2}>
        <BorderHeading>
          {t('toteutuslomake.onkoOpetusMaksullista')}
        </BorderHeading>
        <Flex {...getTestIdProps('maksullisuus')}>
          <FlexItem grow={0} basis="30%">
            <Field name="maksullisuus" component={NoYesField} />
            <MaksullisuusFieldValue>
              {({ maksullisuus }) =>
                maksullisuus ? (
                  <Spacing marginTop={1} {...getTestIdProps('maksunMaara')}>
                    <ExtraField>
                      <Field
                        name={`maksumaara.${language}`}
                        component={FormFieldInput}
                        placeholder={t('yleiset.maara')}
                        helperText={t('yleiset.euroa')}
                      />
                    </ExtraField>
                  </Spacing>
                ) : null
              }
            </MaksullisuusFieldValue>
          </FlexItem>
          <FlexItem grow={1} paddingLeft={3}>
            <Field
              name={`maksullisuusKuvaus.${language}`}
              component={FormFieldTextarea}
              label={t('yleiset.tarkempiKuvaus')}
            />
          </FlexItem>
        </Flex>
      </Spacing>
      {isKorkeakoulu ? (
        <Spacing marginBottom={2}>
          <BorderHeading>
            {t('toteutuslomake.onkoLukuvuosimaksua')}
          </BorderHeading>
          <LukuvuosimaksuFields language={language} />
        </Spacing>
      ) : null}
      {isKorkeakoulu ? (
        <Spacing marginBottom={2}>
          <BorderHeading>
            {t('toteutuslomake.onkoStipenditKaytossa')}
          </BorderHeading>
          <StipendiFields language={language} />
        </Spacing>
      ) : null}
      <Spacing marginBottom={2}>
        <BorderHeading>
          {t('toteutuslomake.koulutuksenAlkamiskausi')}
        </BorderHeading>
        <Flex {...getTestIdProps('alkamiskausi')}>
          <FlexItem grow={0} basis="30%">
            <AlkamiskausiFields name="alkamiskausi" />
          </FlexItem>
          <FlexItem grow={1} paddingLeft={3}>
            <Field
              name={`alkamiskausiKuvaus.${language}`}
              component={FormFieldTextarea}
              label={t('yleiset.tarkempiKuvaus')}
            />
          </FlexItem>
        </Flex>
      </Spacing>
      <Spacing marginBottom={2}>
        <BorderHeading>{t('yleiset.valitseLisattavaOsio')}</BorderHeading>
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
