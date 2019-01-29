import React from 'react';
import styled from 'styled-components';
import { Field } from 'redux-form';
import { formValues } from 'redux-form';

import Button from '../Button';
import Icon from '../Icon';

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

const DropdownButton = styled(Button)`
  display: inline-flex;
`;

const BaseFieldValue = formValues({
  base: 'base',
})(({ base, children }) => children({ base }));

const renderBaseDropdownField = ({ input, onContinue }) => {
  const { onChange } = input;

  return (
    <UncontrolledDropdown
      overlay={
        <DropdownMenu>
          <DropdownMenuItem onClick={() => {
            onChange('new_koulutus');
            onContinue();
          }}>
            Luo uusi koulutus
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
      {({ ref, onToggle, visible }) => (
        <DropdownButton innerRef={ref} onClick={onToggle} type="button">
          Valitse pohja{' '}
          <Icon type={visible ? 'arrow_drop_up' : 'arrow_drop_down'} />
        </DropdownButton>
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

const BaseSelectionSection = ({ onContinue }) => {
  return (
    <ContentContainer>
      <DropdownContainer>
        <Field name="base" component={renderBaseDropdownField} onContinue={onContinue} />
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
                  name="education"
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
