import React from 'react';
import { Field, FieldArray, formValues } from 'redux-form';
import styled, { css } from 'styled-components';

import Typography from '../Typography';
import Spacing from '../Spacing';
import LanguageSelector from '../LanguageSelector';
import Checkbox from '../Checkbox';
import InputMask from '../InputMask';
import Button from '../Button';

const renderCheckboxField = ({ input, label = null }) => (
  <Checkbox checked={input.value} onChange={input.onChange} children={label} />
);

const renderInputMaskField = ({ input, ...props }) => (
  <InputMask {...input} {...props} />
);

const HakuContainer = styled.div`
  display: flex;
  margin-bottom: ${({ theme }) => theme.spacing.unit * 2}px;
  align-items: center;
`;

const HakuDateTimeContainer = styled.div`
  flex: 1;
  ${({ first }) =>
    first
      ? css`
          padding-right: ${({ theme }) => theme.spacing.unit * 2}px;
        `
      : css`
          padding-left: ${({ theme }) => theme.spacing.unit * 2}px;
        `}
`;

const HakuDateTimeWrapper = styled.div`
  display: flex;
`;

const HakuDateContainer = styled.div`
  flex: 1;
  padding-right: ${({ theme }) => theme.spacing.unit * 2}px;
`;

const HakuTimeContainer = styled.div`
  flex: 0;
  flex-basis: 30%;
`;

const HakuRemoveContainer = styled.div`
  flex: 0;
  padding-left: ${({ theme }) => theme.spacing.unit * 2}px;
  display: flex;
  align-items: center;
`;

const renderHakuajatFields = ({ fields }) => (
  <>
    {fields.map((hakuaika, index) => (
      <HakuContainer key={index}>
        <HakuDateTimeContainer first>
          <Typography as="div" marginBottom={1}>
            Alkaa
          </Typography>
          <HakuDateTimeWrapper>
            <HakuDateContainer>
              <Field
                name={`${hakuaika}.fromDate`}
                placeholder="pp.kk.vvvv"
                component={renderInputMaskField}
                mask="99.99.9999"
              />
            </HakuDateContainer>
            <HakuTimeContainer>
              <Field
                name={`${hakuaika}.fromTime`}
                placeholder="tt:mm"
                component={renderInputMaskField}
                mask="99:99"
              />
            </HakuTimeContainer>
          </HakuDateTimeWrapper>
          <Typography variant="secondary" as="div" marginTop={1}>
            Alkuajan päivämäärä ja kellonaika
          </Typography>
        </HakuDateTimeContainer>
        <HakuDateTimeContainer>
          <Typography as="div" marginBottom={1}>
            Päättyy
          </Typography>
          <HakuDateTimeWrapper>
            <HakuDateContainer>
              <Field
                name={`${hakuaika}.toDate`}
                placeholder="pp.kk.vvvv"
                component={renderInputMaskField}
                mask="99.99.9999"
              />
            </HakuDateContainer>
            <HakuTimeContainer>
              <Field
                name={`${hakuaika}.toTime`}
                placeholder="tt:mm"
                component={renderInputMaskField}
                mask="99:99"
              />
            </HakuTimeContainer>
          </HakuDateTimeWrapper>
          <Typography variant="secondary" as="div" marginTop={1}>
            Päätösajan päivämäärä ja kellonaika
          </Typography>
        </HakuDateTimeContainer>
        <HakuRemoveContainer>
          <Button
            type="button"
            onClick={() => {
              fields.remove(index);
            }}
            variant="outlined"
            color="secondary"
          >
            Poista
          </Button>
        </HakuRemoveContainer>
      </HakuContainer>
    ))}
    <Button
      type="button"
      onClick={() => {
        fields.push({});
      }}
    >
      Lisää hakuaika
    </Button>
  </>
);

const CustomHakuaika = () => {
  return (
    <Spacing marginTop={2}>
      <FieldArray name="hakuajat" component={renderHakuajatFields} />
    </Spacing>
  );
};

const EriHakuaikaFieldValue = formValues({
  eriHakuaika: 'eriHakuaika',
})(({ eriHakuaika, children }) => children({ eriHakuaika }));

const HakuajatSection = ({ languages }) => {
  return (
    <LanguageSelector languages={languages} defaultValue="fi">
      {({ value: activeLanguage }) => (
        <>
          <Field
            name="eriHakuaika"
            component={renderCheckboxField}
            label="Hakukohteen hakuaika on eri kuin haun aikataulu"
          />
          <EriHakuaikaFieldValue>
            {({ eriHakuaika }) => (eriHakuaika ? <CustomHakuaika /> : null)}
          </EriHakuaikaFieldValue>
        </>
      )}
    </LanguageSelector>
  );
};

export default HakuajatSection;
