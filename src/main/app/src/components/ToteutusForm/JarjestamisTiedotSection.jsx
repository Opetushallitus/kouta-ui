import React, { useMemo } from 'react';
import { Field, formValues } from 'redux-form';
import styled from 'styled-components';
import get from 'lodash/get';
import mapValues from 'lodash/mapValues';

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
import { getKoodisto } from '../../apiUtils';
import {
  isArray,
  arrayToTranslationObject,
  getFirstLanguageValue,
} from '../../utils';
import { useApiAsync } from '../useApiAsync';
import Select from '../Select';

const BorderHeading = styled(Typography).attrs({
  variant: 'h6',
  paddingBottom: 1,
  marginBottom: 2,
})`
  border-bottom: 1px solid ${({ theme }) => theme.palette.border};
`;

const getOsiot = async ({ httpClient, apiUrls }) => {
  const osiot = await getKoodisto({
    koodistoUri: 'koulutuksenjarjestamisenlisaosiot',
    httpClient,
    apiUrls,
  });

  return isArray(osiot)
    ? osiot.map(({ metadata, koodiUri, versio }) => ({
        koodiUri: `${koodiUri}#${versio}`,
        nimi: mapValues(arrayToTranslationObject(metadata), ({ nimi }) => nimi),
      }))
    : [];
};

const getOsiotOptions = osiot =>
  osiot.map(({ nimi, koodiUri }) => ({
    value: koodiUri,
    label: getFirstLanguageValue(nimi),
  }));

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

const renderOpetustapaField = ({ input }) => (
  <OpetustapaCheckboxGroup {...input} />
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

const maksullisuusOptions = [
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

const MaksullisuusFieldValue = formValues({
  maksullisuus: 'maksullisuus',
})(({ maksullisuus, children }) => children({ maksullisuus }));

const MaksuWrapper = styled.div`
  max-width: 250px;
  width: 100%;
  display: flex;
  align-items: center;
`;

const MaksuInputContainer = styled.div`
  flex: 1;
`;

const MaksuCurrencyContainer = styled.div`
  flex: 0;
  padding-left: ${({ theme }) => theme.spacing.unit}px;
`;

const MaksuContainer = ({ language }) => (
  <Spacing marginTop={1}>
    <MaksuWrapper>
      <MaksuInputContainer>
        <Field
          name={`maksumaara.${language}`}
          type="number"
          component={renderInputField}
          placeholder="Maksun määrä"
        />
      </MaksuInputContainer>
      <MaksuCurrencyContainer>
        <Typography>euroa</Typography>
      </MaksuCurrencyContainer>
    </MaksuWrapper>
  </Spacing>
);

const JarjestamisTiedotContent = ({ language }) => {
  const { data: osiot } = useApiAsync({ promiseFn: getOsiot });

  const osiotOptions = useMemo(() => {
    return getOsiotOptions(osiot || []);
  }, [osiot]);

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
              options={maksullisuusOptions}
            />
            <MaksullisuusFieldValue>
              {({ maksullisuus }) =>
                maksullisuus === 'kylla' ? (
                  <MaksuContainer language={language} />
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

const JarjestamisTiedotSection = ({ languages = [] }) => {
  return (
    <LanguageSelector languages={languages} defaultValue="fi">
      {({ value: activeLanguage }) => (
        <JarjestamisTiedotContent language={activeLanguage} />
      )}
    </LanguageSelector>
  );
};

export default JarjestamisTiedotSection;
