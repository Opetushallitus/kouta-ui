import React from 'react';
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
}) => {
  const { value } = input;

  return (
    <>
      <Checkbox {...input}>{label}</Checkbox>
      {!!value ? (
        <Spacing marginTop={2} marginBottom={isLast ? 0 : 2}>
          <FieldArray
            name={`${vaatimus}.kuvaukset.${vaatimusTyyppi}`}
            component={renderKuvauksetField}
            kuvausOptions={kuvausOptions}
          />
        </Spacing>
      ) : null}
    </>
  );
};

const renderKuvauksetField = ({ fields, kuvausOptions }) => {
  return (
    <>
      {fields.map((kuvaus, index) => (
        <Flex marginBottom={2} key={index} alignEnd>
          <FlexItem grow={1} paddingRight={2}>
            <Typography variant="h6" marginBottom={1}>
              Valitse kuvaus
            </Typography>
            <Field
              name={`${kuvaus}.kuvaus`}
              component={renderSelectField}
              options={kuvausOptions}
            />
          </FlexItem>
          <FlexItem grow={0} basis="20%">
            <Typography variant="h6" marginBottom={1}>
              Taso
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
              Poista
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
        Lisää kuvaus
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
}) => {
  return (
    <>
      {fields.map((vaatimus, index) => {
        return (
          <Spacing key={index}>
            <Spacing marginBottom={2}>
              <Typography variant="h6" marginBottom={1}>
                Valitse kieli
              </Typography>
              <Field
                name={`${vaatimus}.kieli`}
                component={renderLanguageSelectField}
              />
            </Spacing>

            <Flex>
              <FlexItem grow={1}>
                <Typography variant="h6" marginBottom={1}>
                  Valitse vaatimustyypit
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
                  />
                ))}
              </FlexItem>
              <FlexItem grow={0} basis="40%" paddingLeft={4}>
                <Spacing marginBottom={2}>
                  <Typography variant="h6" marginBottom={1}>
                    Ehdot kielitaidon osoitukseen, tai vapautukseen
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
                Poista
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
        Lisää kielitaitovaatimus
      </Button>
    </>
  );
};

const renderMuutOsoitustavatField = ({ fields, language }) => {
  return (
    <>
      {fields.map((tapa, index) => (
        <Flex marginBottom={2} key={index} alignEnd>
          <FlexItem grow={1}>
            <Typography variant="h6" marginBottom={1}>
              Kuvaus
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
              Poista
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
        Lisää ehto
      </Button>
    </>
  );
};

const KielitaitovaatimuksetSection = ({ languages }) => {
  const { options: fullOsoitusOptions } = useKoodistoOptions({
    koodisto: 'kielitaidonosoittaminen',
  });

  const { options: kielitaitoOptions } = useKoodistoOptions({
    koodisto: 'kielitaitovaatimustyypit',
  });

  const { options: kuvausOptions } = useKoodistoOptions({
    koodisto: 'kielitaitovaatimustyypitkuvaus',
  });

  const osoitusOptions = fullOsoitusOptions.filter(
    ({ value }) =>
      !new RegExp(`^${VALINTAPERUSTEET_KIELITAITO_MUU_OSOITUS_KOODI_URI}`).test(
        value,
      ),
  );

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
        />
      )}
    </LanguageSelector>
  );
};

export default KielitaitovaatimuksetSection;
