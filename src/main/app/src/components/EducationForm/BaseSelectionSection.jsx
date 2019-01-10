import React from 'react';
import styled from 'styled-components';
import { Field } from 'redux-form';

import Button from '../Button';

import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownMenuItem,
} from '../Dropdown';

import Typography from '../Typography';
import Select, { Option } from '../Select';

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

const renderEducationSelection = ({ options = [], input }) => (
  <Select {...input}>
    {options.map(({ label, value }) => (
      <Option value={value} key={value}>
        {label}
      </Option>
    ))}
  </Select>
);

const BaseSelectionSection = props => {
  return (
    <ContentContainer>
      <DropdownContainer>
        <Typography variant="h6" marginBottom={1}>
          Luo uusi
        </Typography>
        <UncontrolledDropdown
          overlay={
            <DropdownMenu>
              <DropdownMenuItem>Luo uusi koulutus</DropdownMenuItem>
              <DropdownMenuItem>
                Kopio pohjaksi aiemmin luotu koulutus
              </DropdownMenuItem>
              <DropdownMenuItem>
                Käytä olemassa olevaa koulutusta
              </DropdownMenuItem>
            </DropdownMenu>
          }
        >
          {({ ref, onToggle }) => (
            <Button innerRef={ref} onClick={onToggle}>
              Valitse pohja
            </Button>
          )}
        </UncontrolledDropdown>
      </DropdownContainer>
      <SelectionContainer>
        <Typography variant="h6" marginBottom={1}>
          Valitse koulutus
        </Typography>
        <Field
          name="education"
          options={[{ label: 'Koulutus 1', value: 'koulutus_1' }]}
          component={renderEducationSelection}
        />
      </SelectionContainer>
    </ContentContainer>
  );
};

export default BaseSelectionSection;
