import React from 'react';
import styled from 'styled-components';
import { Field, formValues } from 'redux-form';

import Flex, { FlexItem } from '../Flex';
import Button from '../Button';
import Select from '../Select';
import Typography from '../Typography';
import DropdownIcon from '../DropdownIcon';
import useTranslation from '../useTranslation';

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

const renderPohjaField = ({ input, onContinue, t }) => {
  const { onChange } = input;

  const overlay = (
    <DropdownMenu>
      <DropdownMenuItem
        onClick={() => {
          onChange('new_valintaperuste');
          onContinue();
        }}
      >
        {t('valintaperustelomake.luoUusiValintaperuste')}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onChange('copy_valintaperuste')}>
        {t('valintaperustelomake.kopioiPohjaksiValintaperuste')}
      </DropdownMenuItem>
    </DropdownMenu>
  );

  return (
    <UncontrolledDropdown overlay={overlay}>
      {({ ref, onToggle, visible }) => (
        <DropdownButton innerRef={ref} onClick={onToggle} type="button">
          {t('yleiset.valitsePohja')} <DropdownIcon open={visible} />
        </DropdownButton>
      )}
    </UncontrolledDropdown>
  );
};

const renderSelectField = ({ input, options }) => (
  <Select {...input} options={options} />
);

const PohjaSection = ({ onContinue = () => {} }) => {
  const { t } = useTranslation();

  return (
    <Flex>
      <FlexItem grow={0} paddingRight={2}>
        <Field
          name="pohja"
          component={renderPohjaField}
          onContinue={onContinue}
          t={t}
        />
      </FlexItem>
      <FlexItem grow={1}>
        <PohjaFieldValue>
          {({ pohja }) =>
            ['copy_valintaperuste', 'existing_valintaperuste'].includes(
              pohja,
            ) ? (
              <>
                <Typography variant="h6" marginBottom={1}>
                  {t('yleiset.valitseValintaperuste')}
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
};

export default PohjaSection;
