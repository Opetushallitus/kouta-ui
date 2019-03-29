import React, { useMemo } from 'react';
import { Field, FieldArray } from 'redux-form';

import Typography from '../Typography';
import Input from '../Input';
import LanguageSelector from '../LanguageSelector';
import LanguageSelect from '../LanguageSelect';
import Spacing from '../Spacing';
import Divider from '../Divider';
import Button from '../Button';
import { VALINTAPERUSTEET_KIELITAITO_MUU_OSOITUS_KOODI_URI } from '../../constants';
import Select from '../Select';
import Flex, { FlexItem } from '../Flex';
import CheckboxGroup from '../CheckboxGroup';
import Checkbox from '../Checkbox';
import { noop } from '../../utils';
import useKoodistoOptions from '../useKoodistoOptions';
import useTranslation from '../useTranslation';

const renderInputField = ({ input }) => <Input {...input} />;

const renderSelectField = ({ input, options, isMulti = false }) => (
  <Select {...input} options={options} onBlur={noop} isMulti={isMulti} />
);

const renderLanguageSelectField = ({ input }) => (
  <LanguageSelect {...input} onBlur={noop} />
);

const renderCheckboxGroupField = ({ input, options }) => (
  <CheckboxGroup {...input} options={options} />
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
      <Checkbox checked={value} onChange={onChange}>
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
    <>
      {fields.map((kuvaus, index) => (
        <Flex marginBottom={2} key={index} alignEnd>
          <FlexItem grow={1} paddingRight={2}>
            <Typography variant="h6" marginBottom={1}>
              {t('yleiset.valitseKuvaus')}
            </Typography>
            <Field
              name={`${kuvaus}.kuvaus`}
              component={renderSelectField}
              options={kuvausOptions}
            />
          </FlexItem>
          <FlexItem grow={0} basis="20%">
            <Typography variant="h6" marginBottom={1}>
              {t('yleiset.taso')}
            </Typography>
            <Field name={`${kuvaus}.taso`} component={renderInputField} />
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
      >
        {t('yleiset.lisaaKuvaus')}
      </Button>
    </>
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
    <>
      {fields.map((vaatimus, index) => {
        return (
          <Spacing key={index}>
            <Spacing marginBottom={2}>
              <Typography variant="h6" marginBottom={1}>
                {t('yleiset.valitseKieli')}
              </Typography>
              <Field
                name={`${vaatimus}.kieli`}
                component={renderLanguageSelectField}
              />
            </Spacing>

            <Flex>
              <FlexItem grow={1}>
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
              <FlexItem grow={0} basis="40%" paddingLeft={4}>
                <Spacing marginBottom={2}>
                  <Typography variant="h6" marginBottom={1}>
                    {t('valintaperustelomake.ehdotKielitaidonOsoitukseen')}
                  </Typography>
                  <Field
                    name={`${vaatimus}.osoitustavat`}
                    component={renderCheckboxGroupField}
                    options={osoitusOptions}
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
      >
        {t('valintaperustelomake.lisaaKielitaitovaatimus')}
      </Button>
    </>
  );
};

const renderMuutOsoitustavatField = ({ fields, language, t }) => {
  return (
    <>
      {fields.map((tapa, index) => (
        <Flex marginBottom={2} key={index} alignEnd>
          <FlexItem grow={1}>
            <Typography variant="h6" marginBottom={1}>
              {t('yleiset.kuvaus')}
            </Typography>
            <Field
              name={`${tapa}.kuvaus.${language}`}
              component={renderInputField}
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
