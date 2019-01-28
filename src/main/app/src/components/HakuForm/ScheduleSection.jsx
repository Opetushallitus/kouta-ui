import React from 'react';
import styled from 'styled-components';
import { Field } from 'redux-form';

import Icon from '../Icon';
import Input from '../Input';
import Radio, { RadioGroup } from '../Radio';
import Select from '../Select';
import Typography from '../Typography';

const FieldWrapper = styled.div`
  margin-bottom: 27px;
`;

const ContentWrapper = styled.div`
  display: inline-block;
  margin-right: 30px; 
`;

const ContentHeader = styled(Typography)`
  margin-bottom: 6px;
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

const DateInput = styled(Input)`
  display: inline-block; 
  width: 155px;
`;

const TimeInput = styled(Input)`
  display: inline-block;
  width: 80px;
  margin-left: 10px;
`;

const EventIcon = styled(Icon)`
  display: inline-block;
  margin-left: 5px;
  font-size: 22px;
  vertical-align: sub;
  color: #2da0c7;
`;

const AddWrapper = styled.div`
  margin-top: 17px;
`;

const AddIcon = styled(Icon)`
  display: inline-block;
  margin-left: -3px;
  font-size: 22px;
  vertical-align: bottom;
  color: #2da0c7;
`;

const AddText = styled(Typography)`
  color: #2da0c7; 
  border-bottom: solid 1px #2da0c7;
  margin-left: 8px;
`;

const SelectionContainer = styled.div`
  flex: 1;
  padding-left: ${({ theme }) => theme.spacing.unit * 3}px;
`;

const renderYearSelectionField = ({ options = [], input }) => (
  <Select options={options} {...input}>
  </Select>
);

const renderRadioField = ({ input }) => (
  <RadioGroup style={{'display': 'inline-block'}} {...input}>
    <Radio value="a">Kevät</Radio>
    <Radio value="b">Kesä</Radio>
    <Radio value="c">Syksy</Radio>
  </RadioGroup>
);

const renderDateInputField = ({ input }) => {
  const { onChange, value } = input;
  return (
    <DateInput placeholder="pp.kk.vvvv" onChange={onChange} value={value} />
  );
};

const renderTimeInputField = ({ input }) => {
  const { onChange, value } = input;
  return (
    <TimeInput placeholder="Klo" onChange={onChange} value={value} />
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
        <ContentWrapper>
          <ContentHeader variant="h6">
            Alkaa
          </ContentHeader>
          <Field name="1" component={renderDateInputField} />
          <EventIcon type="event" />
          <Field name="2" component={renderTimeInputField} />
        </ContentWrapper>
        <div style={{'display': 'inline-block'}}>
          <ContentHeader variant="h6">
            Päättyy
          </ContentHeader>
          <Field name="3" component={renderDateInputField} />
          <EventIcon type="event" />
          <Field name="4" component={renderTimeInputField} />
        </div>
        <AddWrapper>
          <AddIcon type="add_box" />
          <AddText>
            Lisää uusi hakuaika
          </AddText>
        </AddWrapper>
      </FieldWrapper>
      <FieldWrapper>
        <HeaderWrapper>
          <HeaderColum>
            <HeaderIcon type="arrow_right" />
            Oppijalle näkyvä informatiivinen aikataulu tulevaisuudesta
          </HeaderColum>
        </HeaderWrapper>
        <ContentWrapper>
          <ContentHeader variant="h6">
            Alkaa
          </ContentHeader>
          <Field name="5" component={renderDateInputField} />
          <EventIcon type="event" />
          <Field name="6" component={renderTimeInputField} />
        </ContentWrapper>
        <div style={{'display': 'inline-block'}}>
          <ContentHeader variant="h6">
            Päättyy
          </ContentHeader>
          <Field name="7" component={renderDateInputField} />
          <EventIcon type="event" />
          <Field name="8" component={renderTimeInputField} />
        </div>
        <AddWrapper>
          <AddIcon type="add_box" />
          <AddText>
            Lisää uusi hakuaika
          </AddText>
        </AddWrapper>
      </FieldWrapper>
      <FieldWrapper>
        <HeaderWrapper>
          <HeaderColum>
            <HeaderIcon type="arrow_right" />
            Koulutuksen alkamiskausi
          </HeaderColum>
        </HeaderWrapper>
        <div style={{'display': 'block', 'marginRight': '30px'}}>
          <Field name="season" component={renderRadioField} />
          <SelectionContainer style={{'display': 'inline-block', 'marginLeft': '30px', 'verticalAlign': 'top', 'marginTop': '23px'}}>
            <Typography style={{'display': 'inline-block', 'marginRight': '10px'}}>Vuosi</Typography>
            <div style={{'display': 'inline-block', 'width': '188px'}}>
              <Field
                name="years"
                options={[{ label: '2019', value: '2019' }, { label: '2020', value: '2020' }]}
                component={renderYearSelectionField}
              />
            </div>
          </SelectionContainer>
        </div>
      </FieldWrapper>
      <FieldWrapper>
        <HeaderWrapper>
          <HeaderColum>
            <HeaderIcon type="arrow_right" />
            Hakukohteen lisäämisen ja perumisen takaraja
          </HeaderColum>
        </HeaderWrapper>
        <ContentWrapper>
          <Field name="9" component={renderDateInputField} />
          <EventIcon type="event" />
          <Field name="10" component={renderTimeInputField} />
        </ContentWrapper>
      </FieldWrapper>
      <FieldWrapper>
        <HeaderWrapper>
          <HeaderColum>
            <HeaderIcon type="arrow_right" />
            Hakukohteen muokkauksen takaraja
          </HeaderColum>
        </HeaderWrapper>
        <ContentWrapper>
          <Field name="11" component={renderDateInputField} />
          <EventIcon type="event" />
          <Field name="12" component={renderTimeInputField} />
        </ContentWrapper>
      </FieldWrapper>
      <FieldWrapper>
        <HeaderWrapper>
          <HeaderColum>
            <HeaderIcon type="arrow_right" />
            Ajastettu haun julkaisupäivämäärä
          </HeaderColum>
        </HeaderWrapper>
        <ContentWrapper>
          <Field name="13" component={renderDateInputField} />
          <EventIcon type="event" />
          <Field name="14" component={renderTimeInputField} />
        </ContentWrapper>
      </FieldWrapper>
    </div>
  );
};

export default ScheduleSection;