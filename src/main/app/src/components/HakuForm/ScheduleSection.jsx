import React from 'react';
import styled, { css } from 'styled-components';
import { Field, FieldArray } from 'redux-form';
import getYear from 'date-fns/get_year';
import mapValues from 'lodash/mapValues';

import Icon from '../Icon';
import Radio, { RadioGroup } from '../Radio';
import Button from '../Button';
import Spacing from '../Spacing';
import InputMask from '../InputMask';
import Typography from '../Typography';
import { getThemeProp } from '../../theme';
import NativeSelect, { Option } from '../NativeSelect';
import ApiAsync from '../ApiAsync';
import { getKoodisto } from '../../apiUtils';
import {
  isArray,
  getFirstLanguageValue,
  arrayToTranslationObject,
} from '../../utils';


const FieldWrapper = styled.div`
  margin-bottom: 27px;
`;

const HeaderWrapper = styled.div`
  margin-bottom: 12px;
  border-bottom: solid 1px #979797;
  width: 570px;
`;

const HeaderColum = styled(Typography)`
  font-weight: 600;
  color: #6e6e7e;
  font-size: 18px;
`;

const HeaderIcon = styled(Icon)`
  font-size: 18px;
  vertical-align: sub;
  margin-left: -8px;
  color: #6e6e7e;
`;

const EventIcon = styled(Icon)`
  display: inline-block;
  margin-left: 5px;
  font-size: 22px;
  margin-top: 8px;
  color: ${getThemeProp('palette.primary.main')};
`;

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

const HakuDateSecondContainer = styled.div`
  flex: 0;
  & > input {
    width: 155px;  
  }
`;

const HakuTimeContainer = styled.div`
  flex: 0;
  flex-basis: 30%;
`;

const HakuTimeSecondContainer = styled.div`
  flex: 0;
  flex-basis: 30%;
  & > input {
    width: 80px;
    margin-left: 10px;
  }
`;

const HakuRemoveContainer = styled.div`
  flex: 0;
  padding-left: ${({ theme }) => theme.spacing.unit * 2}px;
  display: flex;
  align-items: center;
`;

const getHakukaudet = async ({ httpClient, apiUrls }) => {
  const hakukaudet = await getKoodisto({
    koodistoUri: 'kausi',
    httpClient,
    apiUrls,
  });

  return isArray(hakukaudet)
    ? hakukaudet.map(({ metadata, koodiUri, versio }) => ({
        koodiUri: `${koodiUri}#${versio}`,
        nimi: mapValues(arrayToTranslationObject(metadata), ({ nimi }) => nimi),
      }))
    : [];
};

const renderRadioGroupField = ({ input, options }) => (
  <RadioGroup {...input}>
    {options.map(({ value, label }) => (
      <Radio value={value} key={value}>
        {label}
      </Radio>
    ))}
  </RadioGroup>
);

const currentYear = getYear(new Date());

const yearOptions = [...new Array(10)].map((value, index) => ({
  value: `${currentYear + index}`,
  label: `${currentYear + index}`,
}));

const renderYearField = ({ input }) => (
  <NativeSelect {...input}>
    <Option value="">Valitse vuosi</Option>
    {yearOptions.map(({ value, label }) => (
      <Option value={value} key={value}>
        {label}
      </Option>
    ))}
  </NativeSelect>
);

const getHakukausiOptions = hakukaudet =>
  hakukaudet.map(({ koodiUri, nimi }) => ({
    value: koodiUri,
    label: getFirstLanguageValue(nimi),
  }));

const renderInputMaskField = ({ input, ...props }) => (
  <InputMask {...input} {...props} />
);

const renderHakuajatFields = ({ fields }) => {
  if(fields.length == 0){
    fields.push({})
  }
  return (
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
};

const ContentWrapper = ({name}) => {
  return (
    <Spacing marginTop={2}>
      <FieldArray name={name} component={renderHakuajatFields} />
    </Spacing>

  );
};

const ScheduleSection = props => {
  return ( 
    <div>
      <FieldWrapper>
        <HeaderWrapper>
          <HeaderColum>
            <HeaderIcon type="arrow_right" />Hakuaika
          </HeaderColum>
        </HeaderWrapper>
        <ContentWrapper name="hakuaika"/>
      </FieldWrapper>
      <FieldWrapper>
        <HeaderWrapper>
          <HeaderColum>
            <HeaderIcon type="arrow_right" />
            Oppijalle näkyvä informatiivinen aikataulu tulevaisuudesta
          </HeaderColum>
        </HeaderWrapper>
        <ContentWrapper name="aikataulu"/>
      </FieldWrapper>
      <FieldWrapper>
        <HeaderWrapper>
          <HeaderColum>
            <HeaderIcon type="arrow_right" />
            Koulutuksen alkamiskausi
          </HeaderColum>
        </HeaderWrapper>
        <Spacing marginRight={4}>
          <ApiAsync promiseFn={getHakukaudet}>
            {({ data }) => (
              <>
                <Spacing marginBottom={2}>
                  <Typography variant="h6" marginBottom={1}>
                    Kausi
                  </Typography>
                  {isArray(data) ? (
                    <Field
                      name="kausi"
                      component={renderRadioGroupField}
                      options={getHakukausiOptions(data)}
                    />
                  ) : null}
                </Spacing>
                <Spacing>
                  <Typography variant="h6" marginBottom={1}>
                    Vuosi
                  </Typography>
                  <Field name="vuosi" component={renderYearField} />
                </Spacing>
              </>
            )}
          </ApiAsync>
        </Spacing>
      </FieldWrapper>
      <FieldWrapper>
        <HeaderWrapper>
          <HeaderColum>
            <HeaderIcon type="arrow_right" />
            Hakukohteen lisäämisen ja perumisen takaraja
          </HeaderColum>
        </HeaderWrapper>
        <HakuDateTimeWrapper>
          <HakuDateSecondContainer>
            <Field name="lisääminen/peruminen.pvm"
                    placeholder="pp.kk.vvvv"
                    component={renderInputMaskField}
                    mask="99.99.9999" />
          </HakuDateSecondContainer>
          <EventIcon type="event" />
          <HakuTimeSecondContainer>
            <Field name="lisääminen/peruminen.aika"
                    placeholder="tt:mm"
                    component={renderInputMaskField}
                    mask="99:99" />
          </HakuTimeSecondContainer>
        </HakuDateTimeWrapper>
      </FieldWrapper>
      <FieldWrapper>
        <HeaderWrapper>
          <HeaderColum>
            <HeaderIcon type="arrow_right" />
            Hakukohteen muokkauksen takaraja
          </HeaderColum>
        </HeaderWrapper>
        <HakuDateTimeWrapper>
          <HakuDateSecondContainer>
            <Field name="muokkaus.pvm"
                    placeholder="pp.kk.vvvv"
                    component={renderInputMaskField}
                    mask="99.99.9999" />
          </HakuDateSecondContainer>
          <EventIcon type="event" />
          <HakuTimeSecondContainer>
            <Field name="muokkaus.aika"
                    placeholder="tt:mm"
                    component={renderInputMaskField}
                    mask="99:99" />
          </HakuTimeSecondContainer>
        </HakuDateTimeWrapper>
      </FieldWrapper>
      <FieldWrapper>
        <HeaderWrapper>
          <HeaderColum>
            <HeaderIcon type="arrow_right" />
            Ajastettu haun julkaisupäivämäärä
          </HeaderColum>
        </HeaderWrapper>
        <HakuDateTimeWrapper>
          <HakuDateSecondContainer>
            <Field name="julkaisu.pvm"
                    placeholder="pp.kk.vvvv"
                    component={renderInputMaskField}
                    mask="99.99.9999" />
          </HakuDateSecondContainer>
          <EventIcon type="event" />
          <HakuTimeSecondContainer>
            <Field name="julkaisu.aika"
                    placeholder="tt:mm"
                    component={renderInputMaskField}
                    mask="99:99" />
        </HakuTimeSecondContainer>
        </HakuDateTimeWrapper>
      </FieldWrapper>
    </div>
  );
};

export default ScheduleSection;