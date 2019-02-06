import React from 'react';
import styled from 'styled-components';
import { Field, formValues } from 'redux-form';

import Flex, { FlexItem } from '../Flex';
import Button from '../Button';
import Icon from '../Icon';
import Select from '../Select';
import Typography from '../Typography';

import {
  DropdownMenu,
  DropdownMenuItem,
  UncontrolledDropdown,
} from '../Dropdown';

const DropdownButton = styled(Button)`
  display: inline-flex;
`;

const PohjaFieldValue = formValues('pohja')(({ pohja, children }) =>
  children({ pohja }),
);

const renderPohjaField = ({ input, onContinue }) => {
  const { onChange } = input;

  const overlay = (
    <DropdownMenu>
      <DropdownMenuItem
        onClick={() => {
          onChange('new_valintaperuste');
          onContinue();
        }}
      >
        Luo uusi valintaperuste
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onChange('copy_valintaperuste')}>
        Kopio pohjaksi aiemmin luotu valintaperuste
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onChange('existing_valintaperuste')}>
        Käytä olemassa olevaa valintaperustetta
      </DropdownMenuItem>
    </DropdownMenu>
  );

  return (
    <UncontrolledDropdown overlay={overlay}>
      {({ ref, onToggle, visible }) => (
        <DropdownButton innerRef={ref} onClick={onToggle} type="button">
          Valitse pohja{' '}
          <Icon type={visible ? 'arrow_drop_up' : 'arrow_drop_down'} />
        </DropdownButton>
      )}
    </UncontrolledDropdown>
  );
};

const renderSelectField = ({ input, options }) => (
  <Select {...input} options={options} />
);

const PohjaSection = ({ onContinue = () => {} }) => (
  <Flex>
    <FlexItem grow={0} paddingRight={2}>
      <Field
        name="pohja"
        component={renderPohjaField}
        onContinue={onContinue}
      />
    </FlexItem>
    <FlexItem grow={1}>
      <PohjaFieldValue>
        {({ pohja }) =>
          ['copy_valintaperuste', 'existing_valintaperuste'].includes(pohja) ? (
            <>
              <Typography variant="h6" marginBottom={1}>
                Valitse valintaperuste
              </Typography>
              <Field
                name="valintaperuste"
                component={renderSelectField}
                options={[]}
              />
            </>
          ) : null
        }
      </PohjaFieldValue>
    </FlexItem>
  </Flex>
);

export default PohjaSection;
