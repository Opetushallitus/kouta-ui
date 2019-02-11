import React from 'react';
import styled from 'styled-components';
import { Field } from 'redux-form';

import Typography from '../Typography';
import Radio, { RadioGroup } from '../Radio';
import Select from '../Select';
import Button from '../Button';
import LanguageSelector from '../LanguageSelector';
import Select from '../Select';
import Spacing from '../Spacing';
import { HAKUKOHDE_LOMAKETYYPPI_OPTIONS } from '../../constants';

const SelectionContainer = styled.div`
  flex: 1;
  padding-left: ${({ theme }) => theme.spacing.unit * 3}px;
`;

const RadioFieldContainer = styled.div`
  width: 350px;
  border-right: solid 1px #979797;
  display: inline-block;
`;

const DropdownContainer = styled.div`
  display: inline-block;
  vertical-align: top;
`;

const ButtonContainer = styled.div`
  margin-left: 23px;
  margin-top: 11px;
  float: right;
`;

const ShowLomakeButton = styled(Button)`
  margin-right: ${({ theme }) => theme.spacing.unit * 2}px;
`;

const renderBaseDropdownField = ({ input, options }) => (
  <RadioGroup {...input}>
    {options.map(({ label, value }) => (
      <Radio value={value} key={value}>
        {label}
      </Radio>
    ))}
  </RadioGroup>
);

const FormSelectSection = ({ languages, koodiUri, ...props }) => {
  return ( 
    <div {...props}>
    <LanguageSelector languages={languages} defaultValue="fi">
      {({ value: activeLanguage }) => {
        return (
          <>
            <Spacing marginRight={4}>
              <RadioFieldContainer>
                <div> 
                  <Typography>Valitse mitä hakulomaketta käytetään</Typography>
                </div>
                <Field name={`lomaketyyppi.${activeLanguage}`} component={renderBaseDropdownField} options={HAKUKOHDE_LOMAKETYYPPI_OPTIONS} />
              </RadioFieldContainer>
              <DropdownContainer>
                <Typography paddingLeft={3}>Valitse hakulomake</Typography>
                <SelectionContainer>
                  <Field
                    name={`lomake.${activeLanguage}`}
                    options={[{ label: 'testi lomake 1', value: '1' }, { label: 'testi lomake 2', value: '2' }]}
                    component={renderLomakeSelectionField}
                  />
                </SelectionContainer>
                <ButtonContainer>
                    <ShowLomakeButton type="button" variant="outlined">
                      Näytä lomake
                    </ShowLomakeButton>
                  <Button type="button" variant="outlined">
                    Muokkaa lomaketta
                  </Button>
                </ButtonContainer>
              </DropdownContainer> 
            </Spacing>
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
