import React, { useMemo } from 'react';
import { Field, formValues } from 'redux-form';
import styled from 'styled-components';
import get from 'lodash/get';

import Radio, { RadioGroup } from '../Radio';
import Spacing from '../Spacing';
import Typography from '../Typography';
import Input from '../Input';
import Textarea from '../Textarea';
import LanguageSelector from '../LanguageSelector';
import OpetusaikaRadioGroup from './OpetusaikaRadioGroup';
import OpetuskieliCheckboxGroup from './OpetuskieliCheckboxGroup';
import OpetustapaCheckboxGroup from './OpetustapaCheckboxGroup';
import Flex, { FlexItem } from '../Flex';
import AlkamiskausiFields from './AlkamiskausiFields';
import Select from '../Select';
import { KORKEAKOULUKOULUTUSTYYPIT } from '../../constants';
import useKoodistoOptions from '../useKoodistoOptions';
import { isArray } from '../../utils';

const BorderHeading = styled(Typography).attrs({
  variant: 'h6',
  paddingBottom: 1,
  marginBottom: 2,
})`
  border-bottom: 1px solid ${({ theme }) => theme.palette.border};
`;

const noop = () => {};

const renderInputField = ({ input, ...props }) => (
  <Input {...input} {...props} />
);

const renderOpetusaikaField = ({ input }) => (
  <OpetusaikaRadioGroup {...input} />
);

const renderOpetuskieliField = ({ input }) => (
  <OpetuskieliCheckboxGroup {...input} />
);

const renderOpetustapaField = ({ input: { value, onChange } }) => (
  <OpetustapaCheckboxGroup
    value={value || []}
    onChange={items => isArray(items) && items.length <= 2 && onChange(items)}
  />
);

const renderRadioGroupField = ({ input, options }) => (
  <RadioGroup {...input}>
    {options.map(({ value, label }) => (
      <Radio value={value} key={value}>
        {label}
      </Radio>
    ))}
  </RadioGroup>
);

const renderTextareaField = ({ input, ...props }) => (
  <Textarea {...input} {...props} />
);

const renderSelectField = ({ input, ...props }) => (
  <Select {...input} {...props} onBlur={noop} />
);

const noOrYesOptions = [
  { value: 'ei', label: 'Ei' },
  { value: 'kylla', label: 'Kyllä' },
];

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
    <Spacing marginBottom={index !== osiot.length - 1 ? 2 : 0} key={value}>
      <Typography variant="h6" marginBottom={1}>
        {label}
      </Typography>
      <Field
        name={`osioKuvaukset.${value}.${language}`}
        component={renderTextareaField}
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
})(({ maksullisuus, children }) => children({ maksullisuus }));

const ExtraFieldWrapper = styled.div`
  max-width: 250px;
  width: 100%;
`;

const ExtraField = ({ label = null, children = null }) => (
  <ExtraFieldWrapper>
    {children}
    <Typography variant="secondary" as="div" marginTop={1}>
      {label}
    </Typography>
  </ExtraFieldWrapper>
);

const LukuvuosimaksuFields = ({ language }) => (
  <Flex>
    <FlexItem grow={0} basis="30%">
      <Field
        name="onkoLukuvuosimaksua"
        component={renderRadioGroupField}
        options={noOrYesOptions}
      />
      <WithOnkoLukuvuosimaksua>
        {({ onkoLukuvuosimaksua }) =>
          onkoLukuvuosimaksua === 'kylla' ? (
            <Spacing marginTop={1}>
              <ExtraField label="Euroa">
                <Field
                  name={`lukuvuosimaksu.${language}`}
                  component={renderInputField}
                  placeholder="Maksun määrä"
                />
              </ExtraField>
            </Spacing>
          ) : null
        }
      </WithOnkoLukuvuosimaksua>
    </FlexItem>
    <FlexItem grow={1} paddingLeft={3}>
      <Typography marginBottom={1} as="div">
        Lisätietoa lukuvuosimaksusta
      </Typography>
      <Field
        name={`lukuvuosimaksuKuvaus.${language}`}
        component={renderTextareaField}
      />
    </FlexItem>
  </Flex>
);

const StipendiFields = ({ language }) => (
  <Flex>
    <FlexItem grow={0} basis="30%">
      <Field
        name="onkoStipendia"
        component={renderRadioGroupField}
        options={noOrYesOptions}
      />
      <WithOnkoStipendia>
        {({ onkoStipendia }) =>
          onkoStipendia === 'kylla' ? (
            <Spacing marginTop={1}>
              <ExtraField label="Euroa tai prosenttia">
                <Field
                  name={`stipendinMaara.${language}`}
                  component={renderInputField}
                  placeholder="Stipendin määrä"
                />
              </ExtraField>
            </Spacing>
          ) : null
        }
      </WithOnkoStipendia>
    </FlexItem>
    <FlexItem grow={1} paddingLeft={3}>
      <Typography marginBottom={1} as="div">
        Lisätietoa stipendin myöntämisestä
      </Typography>
      <Field
        name={`stipendinKuvaus.${language}`}
        component={renderTextareaField}
      />
    </FlexItem>
  </Flex>
);

const JarjestamisTiedotContent = ({ language, koulutustyyppi }) => {
  const { options: osiotOptions } = useKoodistoOptions({
    koodisto: 'koulutuksenjarjestamisenlisaosiot',
  });

  const isKorkeakoulu = KORKEAKOULUKOULUTUSTYYPIT.includes(koulutustyyppi);

  return (
    <>
      <Spacing marginBottom={2}>
        <BorderHeading>Opetuskieli</BorderHeading>
        <Flex>
          <FlexItem grow={0} basis="30%">
            <Field name="opetuskieli" component={renderOpetuskieliField} />
          </FlexItem>
          <FlexItem grow={1} paddingLeft={3}>
            <Typography marginBottom={1} as="div">
              Opetuskielen tarkempi kuvaus
            </Typography>
            <Field
              name={`opetuskieliKuvaus.${language}`}
              component={renderTextareaField}
            />
          </FlexItem>
        </Flex>
      </Spacing>
      <Spacing marginBottom={2}>
        <BorderHeading>Pääasiallinen opetusaika</BorderHeading>
        <Flex>
          <FlexItem grow={0} basis="30%">
            <Field name="opetusaika" component={renderOpetusaikaField} />
          </FlexItem>
          <FlexItem grow={1} paddingLeft={3}>
            <Typography marginBottom={1} as="div">
              Opetusajan tarkempi kuvaus
            </Typography>
            <Field
              name={`opetusaikaKuvaus.${language}`}
              component={renderTextareaField}
            />
          </FlexItem>
        </Flex>
      </Spacing>
      <Spacing marginBottom={2}>
        <BorderHeading>Pääasiallinen opetustapa</BorderHeading>
        <Flex>
          <FlexItem grow={0} basis="30%">
            <Field name="opetustapa" component={renderOpetustapaField} />
            <Typography variant="secondary" as="div" marginTop={1}>
              Voit valita enintään kaksi opetustapaa
            </Typography>
          </FlexItem>
          <FlexItem grow={1} paddingLeft={3}>
            <Typography marginBottom={1} as="div">
              Opetustavan tarkempi kuvaus
            </Typography>
            <Field
              name={`opetustapaKuvaus.${language}`}
              component={renderTextareaField}
            />
          </FlexItem>
        </Flex>
      </Spacing>
      <Spacing marginBottom={2}>
        <BorderHeading>Onko opetus maksullista?</BorderHeading>
        <Flex>
          <FlexItem grow={0} basis="30%">
            <Field
              name="maksullisuus"
              component={renderRadioGroupField}
              options={noOrYesOptions}
            />
            <MaksullisuusFieldValue>
              {({ maksullisuus }) =>
                maksullisuus === 'kylla' ? (
                  <Spacing marginTop={1}>
                    <ExtraField label="Euroa">
                      <Field
                        name={`maksumaara.${language}`}
                        component={renderInputField}
                        placeholder="Maksun määrä"
                      />
                    </ExtraField>
                  </Spacing>
                ) : null
              }
            </MaksullisuusFieldValue>
          </FlexItem>
          <FlexItem grow={1} paddingLeft={3}>
            <Typography marginBottom={1} as="div">
              Lisätietoa maksullisuudesta
            </Typography>
            <Field
              name={`maksullisuusKuvaus.${language}`}
              component={renderTextareaField}
            />
          </FlexItem>
        </Flex>
      </Spacing>
      {isKorkeakoulu ? (
        <Spacing marginBottom={2}>
          <BorderHeading>Onko lukuvuosimaksua?</BorderHeading>
          <LukuvuosimaksuFields language={language} />
        </Spacing>
      ) : null}
      {isKorkeakoulu ? (
        <Spacing marginBottom={2}>
          <BorderHeading>Onko stipendit käytössä?</BorderHeading>
          <StipendiFields language={language} />
        </Spacing>
      ) : null}
      <Spacing marginBottom={2}>
        <BorderHeading>Koulutuksen alkamiskausi</BorderHeading>
        <Flex>
          <FlexItem grow={0} basis="30%">
            <AlkamiskausiFields name="alkamiskausi" />
          </FlexItem>
          <FlexItem grow={1} paddingLeft={3}>
            <Typography marginBottom={1} as="div">
              Lisätietoa alkamisajankohdasta
            </Typography>
            <Field
              name={`alkamiskausiKuvaus.${language}`}
              component={renderTextareaField}
            />
          </FlexItem>
        </Flex>
      </Spacing>
      <Spacing marginBottom={2}>
        <BorderHeading>Valitse lisättävä osio</BorderHeading>
        <Field
          name="osiot"
          component={renderSelectField}
          options={osiotOptions}
          isMulti
        />
      </Spacing>
      <OsiotFields language={language} osiotOptions={osiotOptions} />
    </>
  );
};

const JarjestamisTiedotSection = ({ languages = [], koulutustyyppi }) => {
  return (
    <LanguageSelector languages={languages} defaultValue="fi">
      {({ value: activeLanguage }) => (
        <JarjestamisTiedotContent
          language={activeLanguage}
          koulutustyyppi={koulutustyyppi}
        />
      )}
    </LanguageSelector>
  );
};

export default JarjestamisTiedotSection;
