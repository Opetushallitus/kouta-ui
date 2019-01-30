import React from 'react';
import styled from 'styled-components';
import { Field } from 'redux-form';

import Typography from '../Typography';
import Radio, { RadioGroup } from '../Radio';
import Select from '../Select';
import Button from '../Button';
import LanguageSelector from '../LanguageSelector';
import Select from '../Select';

const SelectionContainer = styled.div`
  flex: 1;
  padding-left: ${({ theme }) => theme.spacing.unit * 3}px;
`;

const renderBaseDropdownField = ({ input }) => (
    <RadioGroup style={{'display': 'inline-block'}} {...input}>
      <Radio value="a">Käytetään hakemuspalvelun lomaketta</Radio>
      <Radio value="b">Käytetään järjestelmän hakulomaketta</Radio>
      <Radio value="c">Käytetään muuta hakulomaketta</Radio>
      <Radio value="d">Ei sähköistä hakua</Radio>
    </RadioGroup>
);

const FormSelectSection = ({ languages, koodiUri, ...props }) => {
  return ( 
    <div {...props}>
    <LanguageSelector languages={languages} defaultValue="fi">
      {({ value }) => {
        return (
          <>
            <div style={{'display': 'block', 'marginRight': '30px'}}>
              <div style={{'width': '350px', 'borderRight': 'solid 1px #979797', 'display': 'inline-block'}}>
                <div>
                  <Typography>Valitse mitä hakulomaketta käytetään</Typography>
                </div>
                <Field name="base" component={renderBaseDropdownField} />
              </div>
              <div style={{'display': 'inline-block', 'verticalAlign': 'top'}}>
              <Typography style={{'paddingLeft': '23px'}}>Valitse hakulomake</Typography>
              <SelectionContainer>
                <Field
                  name="education"
                  options={[{ label: 'testi lomake 1', value: '1' }, { label: 'testi lomake 2', value: '2' }]}
                  component={renderLomakeSelectionField}
                />
              </SelectionContainer>
              <div style={{'marginLeft': '23px', 'marginTop': '11px', 'float': 'right'}}>
              <Button style={{'marginRight': '20px'}} type="button" variant="outlined">
                Näytä lomake
              </Button>
              <Button type="button" variant="outlined">
                Muokkaa lomaketta
              </Button>
              </div>
            </div>
            </div>
          </>
          );
        }}
      </LanguageSelector>
    </div>
  )
};

const renderLomakeSelectionField = ({ options = [], input }) => (
  <Select options={options} style={{'maxWidth': '508px'}} {...input}>
  </Select>
);

export default FormSelectSection;
