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

const renderInputField = ({ input, ...props }) => (
  <Input {...input} {...props} />
);

const renderCheckboxGroupField = ({ input, ...props }) => (
  <CheckboxGroup {...input} {...props} />
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

const opetusaikaOptions = [
  {
    value: 'paivaopetus',
    label: 'Päiväopetus',
  },
  { value: 'iltaopetus', label: 'Iltaopetus' },
  { value: 'viikonloppuopetus', label: 'Viikonloppuopetus' },
];

const opetustapaOptions = [
  { value: 'lahiopiskelu', label: 'Lähiopiskelu' },
  { value: 'etaopiskelu', label: 'Etäopiskelu' },
];

const maksullisuusOptions = [
  { value: 'ei', label: 'Ei' },
  { value: 'kylla', label: 'Kyllä' },
];

const osioOptions = [
  { value: 'opintojen_rakenne', label: 'Opintojen rakenne' },
  { value: 'jatko_opintomahdollisuudet', label: 'Jatko-opintomahdollisuudet' },
  { value: 'osaamisalan_valinta', label: 'Osaamisalan valinta' },
  { value: 'sisalto', label: 'Sisältö' },
  { value: 'uramahdollisuudet', label: 'Uramahdollisuudet' },
  { value: 'kohderyhma', label: 'Kohderyhmä' },
  { value: 'kansainvalistyminen', label: 'Kansainvälistyminen' },
  { value: 'yhteistyo', label: 'Yhteistyö muiden toimijoiden kanssa' },
];

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

const MaksuContainer = () => (
  <Spacing marginTop={1}>
    <MaksuWrapper>
      <MaksuInputContainer>
        <Field
          name="maksunmaara"
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

const JarjestamisTiedotSection = ({ organisaatioOid, languages = [] }) => {
  return (
    <LanguageSelector languages={languages} defaultValue="fi">
      {({ value: activeLanguage }) => (
        <>
          <Spacing marginBottom={2}>
            <Typography variant="h6">Opetuskieli</Typography>
          </Spacing>
          <Spacing marginBottom={2}>
            <Typography variant="h6" marginBottom={1}>
              Pääasiallinen opetusaika
            </Typography>
            <Field
              name="opetusaika"
              component={renderRadioGroupField}
              options={opetusaikaOptions}
            />
          </Spacing>
          <Spacing marginBottom={2}>
            <Typography variant="h6" marginBottom={1}>
              Pääasiallinen opetustapa
            </Typography>
            <Field
              name="opetustapa"
              component={renderRadioGroupField}
              options={opetustapaOptions}
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
                maksullisuus === 'kylla' ? <MaksuContainer /> : null
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
          <Spacing>
            <Typography variant="h6" marginBottom={1}>
              Valitse lisättävä osio
            </Typography>
            <Field
              name="osiot"
              component={renderCheckboxGroupField}
              options={osioOptions}
            />
          </Spacing>
        </>
      )}
    </LanguageSelector>
  );
};

export default JarjestamisTiedotSection;
