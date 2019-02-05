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
import Select from '../Select';

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

const BaseFieldValue = formValues({
  base: 'base',
})(({ base, children }) => children({ base }));

const renderBaseDropdownField = ({ input }) => {
  const { onChange } = input;

  return (
    <UncontrolledDropdown
      overlay={
        <DropdownMenu>
          <DropdownMenuItem onClick={() => onChange('new_koulutus')}>
            Luo uusi haku
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChange('copy_koulutus')}>
            Kopio pohjaksi aiemmin luotu koulutus
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChange('existing_koulutus')}>
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
  );
};

const renderEducationSelectionField = ({ options = [], input }) => (
  <Select options={options} {...input}>
  </Select>
);

const BaseSelectionSection = props => {
  return (
    <ContentContainer>
      <DropdownContainer>
        <Typography variant="h6" marginBottom={1}>
          Luo uusi
        </Typography>
        <Field name="base" component={renderBaseDropdownField} />
      </DropdownContainer>
      <SelectionContainer>
        <BaseFieldValue>
          {({ base }) =>
            ['copy_koulutus', 'existing_koulutus'].includes(base) ? (
              <>
                <Typography variant="h6" marginBottom={1}>
                  Valitse koulutus
                </Typography>
                <Field
                  name="koulutus"
                  options={[{ label: 'Koulutus 1', value: 'koulutus_1' }]}
                  component={renderEducationSelectionField}
                />
              </>
            ) : null
          }
        </BaseFieldValue>
      </SelectionContainer>
    </ContentContainer>
  );
};

export default BaseSelectionSection;
