import React from 'react';
import { Field, FieldArray } from 'redux-form';

import Typography from '../Typography';
import Input from '../Input';
import LanguageSelector from '../LanguageSelector';
import LanguageSelect from '../LanguageSelect';
import Spacing from '../Spacing';
import Divider from '../Divider';
import Button from '../Button';
import {
  VALINTAPERUSTEET_KIELITAITO_OPTIONS,
  VALINTAPERUSTEET_KIELITAITO_OSOITUS_OPTIONS,
} from '../../constants';
import Select from '../Select';
import Flex, { FlexItem } from '../Flex';
import CheckboxGroup from '../CheckboxGroup';

const nop = () => {};

const renderInputField = ({ input }) => <Input {...input} />;

const renderSelectField = ({ input, options, isMulti = false }) => (
  <Select {...input} options={options} onBlur={nop} isMulti={isMulti} />
);

const renderLanguageSelectField = ({ input }) => (
  <LanguageSelect {...input} onBlur={nop} />
);

const renderCheckboxGroupField = ({ input, options }) => (
  <CheckboxGroup {...input} options={options} />
);

const renderKuvauksetField = ({ fields }) => {
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
              options={[]}
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

const renderVaatimuksetField = ({ fields, kielitaitoOptions }) => {
  return (
    <>
      {fields.map((vaatimus, index) => (
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

          <Spacing marginBottom={2}>
            <Typography variant="h6" marginBottom={1}>
              Valitse vaatimustyyppi
            </Typography>
            <Field
              name={`${vaatimus}.tyyppi`}
              component={renderSelectField}
              options={kielitaitoOptions}
            />
          </Spacing>

          <FieldArray
            name={`${vaatimus}.kuvaukset`}
            component={renderKuvauksetField}
          />

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
      ))}
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
            <Typography variant="h6" marginBottom={1}>Kuvaus</Typography>
            <Field name={`${tapa}.kuvaus.${language}`} component={renderInputField} />
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
  return (
    <LanguageSelector languages={languages} defaultValue="fi">
      {({ value: activeLanguage }) => (
        <Flex>
          <FlexItem grow={1}>
            <FieldArray
              name="kielet"
              component={renderVaatimuksetField}
              kielitaitoOptions={VALINTAPERUSTEET_KIELITAITO_OPTIONS}
            />
          </FlexItem>
          <FlexItem grow={0} basis="40%" paddingLeft={4}>
            <Spacing marginBottom={2}>
              <Typography variant="h6" marginBottom={1}>
                Ehdot kielitaidon osoitukseen, tai vapautukseen
              </Typography>
              <Field
                name="osoitustavat"
                component={renderCheckboxGroupField}
                options={VALINTAPERUSTEET_KIELITAITO_OSOITUS_OPTIONS}
              />
            </Spacing>
            <FieldArray
              name="muutOsoitustavat"
              component={renderMuutOsoitustavatField}
              language={activeLanguage}
            />
          </FlexItem>
        </Flex>
      )}
    </LanguageSelector>
  );
};

export default KielitaitovaatimuksetSection;
