import React, { useMemo } from 'react';
import { Field, FieldArray } from 'redux-form';

import Typography from '../Typography';
import LanguageSelector from '../LanguageSelector';
import LanguageSelect from '../LanguageSelect';
import Spacing from '../Spacing';
import Divider from '../Divider';
import Button from '../Button';
import { VALINTAPERUSTEET_KIELITAITO_MUU_OSOITUS_KOODI_URI } from '../../constants';
import Flex, { FlexItem } from '../Flex';
import Checkbox from '../Checkbox';
import { noop, getTestIdProps } from '../../utils';
import useKoodistoOptions from '../useKoodistoOptions';
import useTranslation from '../useTranslation';

import {
  FormFieldCheckboxGroup,
  FormFieldInput,
  FormFieldSelect,
  createFormFieldComponent,
} from '../FormFields';

const LanguageField = createFormFieldComponent(
  LanguageSelect,
  ({ input, meta, ...props }) => ({
    ...input,
    onBlur: noop,
    ...props,
  }),
);

const renderVaatimustyyppiField = ({
  input,
  label,
  kuvausOptions,
  vaatimus,
  vaatimusTyyppi,
  isLast,
  t,
}) => {
  const { value, onChange } = input;

  return (
    <>
      <Checkbox checked={value} name={vaatimusTyyppi} onChange={onChange}>
        {label}
      </Checkbox>
      {!!value ? (
        <Spacing marginTop={2} marginBottom={isLast ? 0 : 2}>
          <FieldArray
            name={`${vaatimus}.kuvaukset.${vaatimusTyyppi}`}
            component={renderKuvauksetField}
            kuvausOptions={kuvausOptions}
            t={t}
          />
        </Spacing>
      ) : null}
    </>
  );
};

const renderKuvauksetField = ({ fields, kuvausOptions, t }) => {
  return (
    <div {...getTestIdProps('vaatimusKuvaus')}>
      {fields.map((kuvaus, index) => (
        <Flex marginBottom={2} key={index} alignEnd>
          <FlexItem grow={1} paddingRight={2} {...getTestIdProps('kuvaus')}>
            <Field
              name={`${kuvaus}.kuvaus`}
              component={FormFieldSelect}
              options={kuvausOptions}
              label={t('yleiset.valitseKuvaus')}
            />
          </FlexItem>
          <FlexItem grow={0} basis="20%" {...getTestIdProps('taso')}>
            <Field
              name={`${kuvaus}.taso`}
              label={t('yleiset.taso')}
              component={FormFieldInput}
            />
          </FlexItem>
          <FlexItem grow={0} paddingLeft={2}>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              onClick={() => {
                fields.remove(index);
              }}
            >
              {t('yleiset.poista')}
            </Button>
          </FlexItem>
        </Flex>
      ))}
      <Button
        type="button"
        variant="outlined"
        color="primary"
        onClick={() => {
          fields.push({});
        }}
        {...getTestIdProps('lisaaButton')}
      >
        {t('yleiset.lisaaKuvaus')}
      </Button>
    </div>
  );
};

const renderVaatimuksetField = ({
  fields,
  kielitaitoOptions,
  kuvausOptions,
  osoitusOptions,
  language,
  t,
}) => {
  return (
    <div {...getTestIdProps('kielitaitovaatimuslista')}>
      {fields.map((vaatimus, index) => {
        return (
          <Spacing key={index}>
            <Spacing marginBottom={2} {...getTestIdProps('kielivalinta')}>
              <Field
                name={`${vaatimus}.kieli`}
                component={LanguageField}
                label={t('yleiset.valitseKieli')}
              />
            </Spacing>

            <Flex>
              <FlexItem grow={1} {...getTestIdProps('tyyppivalinta')}>
                <Typography variant="h6" marginBottom={1}>
                  {t('valintaperustelomake.valitseVaatimustyypit')}
                </Typography>

                {kielitaitoOptions.map(({ value, label }, index) => (
                  <Field
                    key={value}
                    name={`${vaatimus}.tyyppi.${value}`}
                    component={renderVaatimustyyppiField}
                    vaatimus={vaatimus}
                    kuvausOptions={kuvausOptions}
                    label={label}
                    vaatimusTyyppi={value}
                    isLast={index === kielitaitoOptions.length - 1}
                    t={t}
                  />
                ))}
              </FlexItem>
              <FlexItem
                grow={0}
                basis="40%"
                paddingLeft={4}
                {...getTestIdProps('osoitusvalinta')}
              >
                <Spacing marginBottom={2}>
                  <Field
                    name={`${vaatimus}.osoitustavat`}
                    component={FormFieldCheckboxGroup}
                    options={osoitusOptions}
                    label={t(
                      'valintaperustelomake.ehdotKielitaidonOsoitukseen',
                    )}
                  />
                </Spacing>
                <FieldArray
                  name={`${vaatimus}.muutOsoitustavat`}
                  component={renderMuutOsoitustavatField}
                  language={language}
                  t={t}
                />
              </FlexItem>
            </Flex>

            <Flex marginTop={2} justifyEnd>
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                onClick={() => {
                  fields.remove(index);
                }}
              >
                {t('yleiset.poista')}
              </Button>
            </Flex>
            <Divider marginTop={3} marginBottom={3} />
          </Spacing>
        );
      })}
      <Button
        type="button"
        onClick={() => {
          fields.push({});
        }}
        {...getTestIdProps('lisaaButton')}
      >
        {t('valintaperustelomake.lisaaKielitaitovaatimus')}
      </Button>
    </div>
  );
};

const renderMuutOsoitustavatField = ({ fields, language, t }) => {
  return (
    <>
      {fields.map((tapa, index) => (
        <Flex marginBottom={2} key={index} alignEnd>
          <FlexItem grow={1}>
            <Field
              name={`${tapa}.kuvaus.${language}`}
              component={FormFieldInput}
              label={t('yleiset.kuvaus')}
            />
          </FlexItem>
          <FlexItem grow={0} paddingLeft={2}>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              onClick={() => {
                fields.remove(index);
              }}
            >
              {t('yleiset.poista')}
            </Button>
          </FlexItem>
        </Flex>
      ))}
      <Button
        type="button"
        color="primary"
        variant="outlined"
        onClick={() => {
          fields.push({});
        }}
      >
        {t('valintaperustelomake.lisaaEhto')}
      </Button>
    </>
  );
};

const KielitaitovaatimuksetSection = ({ languages }) => {
  const { t } = useTranslation();

  const { options: fullOsoitusOptions } = useKoodistoOptions({
    koodisto: 'kielitaidonosoittaminen',
  });

  const { options: kielitaitoOptions } = useKoodistoOptions({
    koodisto: 'kielitaitovaatimustyypit',
  });

  const { options: kuvausOptions } = useKoodistoOptions({
    koodisto: 'kielitaitovaatimustyypitkuvaus',
  });

  const osoitusOptions = useMemo(() => {
    return fullOsoitusOptions.filter(
      ({ value }) =>
        !new RegExp(
          `^${VALINTAPERUSTEET_KIELITAITO_MUU_OSOITUS_KOODI_URI}`,
        ).test(value),
    );
  }, [fullOsoitusOptions]);

  return (
    <LanguageSelector languages={languages} defaultValue="fi">
      {({ value: activeLanguage }) => (
        <FieldArray
          name="kielet"
          component={renderVaatimuksetField}
          kielitaitoOptions={kielitaitoOptions}
          kuvausOptions={kuvausOptions}
          osoitusOptions={osoitusOptions}
          language={activeLanguage}
          t={t}
        />
      )}
    </LanguageSelector>
  );
};

export default KielitaitovaatimuksetSection;
