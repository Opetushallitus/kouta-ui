import React from 'react';
import styled from 'styled-components';
import { Field } from 'redux-form';
import { formValues } from 'redux-form';

import Button from '../Button';

import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownMenuItem,
} from '../Dropdown';

import Typography from '../Typography';
import Select, { Option } from '../NativeSelect';

const ContentContainer = styled.div`
  display: flex;
`;

const DropdownContainer = styled.div`
  flex: 0;
`;

const SelectionContainer = styled.div`
  flex: 1;
  padding-left: ${({ theme }) => theme.spacing.unit * 3}px;
`;

const PohjaFieldValue = formValues({
  pohja: 'pohja',
})(({ pohja, children }) => children({ pohja }));

const renderBaseDropdownField = ({ input }) => {
  const { onChange } = input;

  return (
    <UncontrolledDropdown
      overlay={
        <DropdownMenu>
          <DropdownMenuItem onClick={() => onChange('new_toteutus')}>
            Luo uusi toteutus
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChange('copy_toteutus')}>
            Kopio pohjaksi aiemmin luotu toteutus
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChange('existing_toteutus')}>
            Käytä olemassa olevaa toteutusta
          </DropdownMenuItem>
        </DropdownMenu>
      }
    >
      {({ ref, onToggle }) => (
        <Button innerRef={ref} onClick={onToggle} type="button">
          Valitse pohja
        </Button>
      )}
    </UncontrolledDropdown>
  );
};

const renderEducationSelectionField = ({ options = [], input }) => (
  <Select {...input}>
    {options.map(({ label, value }) => (
      <Option value={value} key={value}>
        {label}
      </Option>
    ))}
  </Select>
);

const PohjaSection = () => {
  return (
    <ContentContainer>
      <DropdownContainer>
        <Field name="pohja" component={renderBaseDropdownField} />
      </DropdownContainer>
      <SelectionContainer>
        <PohjaFieldValue>
          {({ pohja }) =>
            ['copy_toteutus', 'existing_toteutus'].includes(pohja) ? (
              <>
                <Typography variant="h6" marginBottom={1}>
                  Valitse toteutus
                </Typography>
                <Field
                  name="toteutus"
                  options={[{ label: 'Toteutus 1', value: 'Toteutus_1' }]}
                  component={renderEducationSelectionField}
                />
              </>
            ) : null
          }
        </PohjaFieldValue>
      </SelectionContainer>
    </ContentContainer>
  );
};

export default PohjaSection;
