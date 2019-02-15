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
import Select from '../Select';
import ApiAsync from '../ApiAsync';
import { getKoutaHaut } from '../../apiUtils';
import Flex, { FlexItem } from '../Flex';
import Spacing from '../Spacing';
import { getFirstLanguageValue } from '../../utils';

const DropdownButton = styled(Button)`
  display: inline-flex;
`;

const BaseAndEducationFieldValue = formValues({
  base: 'base',
  education: 'education',
})(({ base, education, children }) => children({ base, education }));

const renderBaseDropdownField = ({ input, onCreateNew }) => {
  const { onChange } = input;

  return (
    <UncontrolledDropdown
      overlay={
        <DropdownMenu>
          <DropdownMenuItem
            onClick={() => {
              onChange('new_haku');
              onCreateNew();
            }}
          >
            Luo uusi haku
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChange('copy_haku')}>
            Kopio pohjaksi aiemmin luotu haku
          </DropdownMenuItem>
        </DropdownMenu>
      }
    >
      {({ ref, onToggle, visible }) => (
        <div ref={ref}>
          <DropdownButton onClick={onToggle} type="button">
            Valitse pohja{' '}
            <Icon type={visible ? 'arrow_drop_up' : 'arrow_drop_down'} />
          </DropdownButton>
        </div>
      )}
    </UncontrolledDropdown>
  );
};

const nop = () => {};

const renderSelectField = ({ options = [], input }) => {
  return <Select {...input} options={options} onBlur={nop} />
};

const getHakuOptions = haut => {
  return haut.map(({ nimi, oid }) => ({
    value: oid,
    label: getFirstLanguageValue(nimi),
  }));
};

const BaseSelectionSection = ({ organisaatioOid, onCreateNew }) => {
  return (
    <ApiAsync
      promiseFn={getKoutaHaut}
      organisaatioOid={organisaatioOid}
      watch={organisaatioOid}
    >
      {({ data: haut }) => (
        <Flex>
          <FlexItem grow={0}>
            <Field
              name="base"
              component={renderBaseDropdownField}
              onCreateNew={onCreateNew}
            />
          </FlexItem>
          <FlexItem grow={1} paddingLeft={3}>
            <BaseAndEducationFieldValue>
              {({ base }) =>
                ['copy_haku'].includes(base) ? (
                  <>
                    <Spacing marginBottom={2}>
                      <Typography variant="h6" marginBottom={1}>
                        Valitse haku
                      </Typography>
                      <Field
                        name="education"
                        options={getHakuOptions(haut || [])}
                        component={renderSelectField}
                      />
                    </Spacing>
                  </>
                ) : null
              }
            </BaseAndEducationFieldValue>
          </FlexItem>
        </Flex>
      )}
    </ApiAsync>
  );
};

export default BaseSelectionSection;
