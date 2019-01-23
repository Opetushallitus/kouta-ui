import React from 'react';
import { Field, formValues } from 'redux-form';
import styled from 'styled-components';

import Radio, { RadioGroup } from '../Radio';
import CheckboxGroup from '../CheckboxGroup';
import Spacing from '../Spacing';
import Typography from '../Typography';
import Input from '../Input';
import Textarea from '../Textarea';
import LanguageSelector from '../LanguageSelector';
import { isArray } from '../../utils';
import { TOTEUTUKSEN_OSIOT_OPTIONS } from '../../constants';
import Select from '../Select';
import OpetusaikaRadioGroup from './OpetusaikaRadioGroup';
import OpetuskieliCheckboxGroup from './OpetuskieliCheckboxGroup';
import OpetustapaRadioGroup from './OpetustapaRadioGroup';

const nop = () => {};

const renderInputField = ({ input, ...props }) => (
  <Input {...input} {...props} />
);

const renderSelectField = ({ input, ...props }) => (
  <Select {...input} onBlur={nop} {...props} />
);

const renderOpetusaikaField = ({ input }) => (
  <OpetusaikaRadioGroup {...input} />
);

const renderOpetuskieliField = ({ input }) => (
  <OpetuskieliCheckboxGroup {...input} />
);

const renderOpetustapaField = ({ input }) => (
  <OpetustapaRadioGroup {...input} />
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

const maksullisuusOptions = [
  { value: 'ei', label: 'Ei' },
  { value: 'kylla', label: 'Kyllä' },
];

const renderOsiot = ({ osiot, language }) => {
  const osiotArray = isArray(osiot) ? osiot : [];

  const checkedOsiot = TOTEUTUKSEN_OSIOT_OPTIONS.filter(
    ({ value }) =>
      !!osiotArray.find(({ value: osioValue }) => osioValue === value),
  );

  return checkedOsiot.map(({ value, label }, index) => (
    <Spacing
      marginBottom={index !== checkedOsiot.length - 1 ? 2 : 0}
      key={value}
    >
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

const MaksullisuusFieldValue = formValues({
  maksullisuus: 'maksullisuus',
})(({ maksullisuus, children }) => children({ maksullisuus }));

const OsiotFieldValue = formValues({
  osiot: 'osiot',
})(({ osiot, children }) => children({ osiot }));

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

const JarjestamisTiedotSection = ({ languages = [] }) => {
  return (
    <LanguageSelector languages={languages} defaultValue="fi">
      {({ value: activeLanguage }) => (
        <>
          <Spacing marginBottom={2}>
            <Typography variant="h6" marginBottom={1}>
              Opetuskieli
            </Typography>
            <Field
              name="opetuskieli"
              component={renderOpetuskieliField}
            />
          </Spacing>
          <Spacing marginBottom={2}>
            <Typography variant="h6" marginBottom={1}>
              Pääasiallinen opetusaika
            </Typography>
            <Field
              name="opetusaika"
              component={renderOpetusaikaField}
            />
          </Spacing>
          <Spacing marginBottom={2}>
            <Typography variant="h6" marginBottom={1}>
              Pääasiallinen opetustapa
            </Typography>
            <Field
              name="opetustapa"
              component={renderOpetustapaField}
            />
          </Spacing>
          <Spacing marginBottom={2}>
            <Typography variant="h6" marginBottom={1}>
              Onko opetus maksullista?
            </Typography>
            <Field
              name="maksullisuus"
              component={renderRadioGroupField}
              options={maksullisuusOptions}
            />
            <MaksullisuusFieldValue>
              {({ maksullisuus }) =>
                maksullisuus === 'kylla' ? (
                  <MaksuContainer language={activeLanguage} />
                ) : null
              }
            </MaksullisuusFieldValue>
          </Spacing>
          <Spacing marginBottom={2}>
            <Typography variant="h6" marginBottom={1}>
              Toteutuksen kuvaus
            </Typography>
            <Field
              name={`kuvaus.${activeLanguage}`}
              component={renderTextareaField}
              placeholder="Kirjoita kuvaus, miten koulutuksen toteutus järjestetään teidän oppilaitoksessanne"
            />
          </Spacing>
          <Spacing marginBottom={2}>
            <Typography variant="h6" marginBottom={1}>
              Valitse lisättävä osio
            </Typography>
            <Field
              name="osiot"
              component={renderSelectField}
              options={TOTEUTUKSEN_OSIOT_OPTIONS}
              isMulti
            />
          </Spacing>
          <OsiotFieldValue>
            {({ osiot }) => renderOsiot({ osiot, language: activeLanguage })}
          </OsiotFieldValue>
        </>
      )}
    </LanguageSelector>
  );
};

export default JarjestamisTiedotSection;
