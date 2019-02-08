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
import { getKoutaKoulutukset } from '../../apiUtils';
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

const renderBaseDropdownField = ({ input, onContinue }) => {
  const { onChange } = input;

  return (
    <UncontrolledDropdown
      overlay={
        <DropdownMenu>
          <DropdownMenuItem
            onClick={() => {
              onChange('new_koulutus');
              onContinue();
            }}
          >
            Luo uusi koulutus
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChange('copy_koulutus')}>
            Kopio pohjaksi aiemmin luotu koulutus
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

const nop = () => {};

const renderSelectField = ({ options = [], input }) => (
  <Select {...input} options={options} onBlur={nop} />
);

const getKoulutusOptions = koulutukset => {
  return koulutukset.map(({ nimi, oid }) => ({
    value: oid,
    label: getFirstLanguageValue(nimi),
  }));
};

const BaseSelectionSection = ({ onContinue, organisaatioOid, onCopy }) => {
  return (
    <ApiAsync
      promiseFn={getKoutaKoulutukset}
      organisaatioOid={organisaatioOid}
      watch={organisaatioOid}
    >
      {({ data: koulutukset }) => (
        <Flex>
          <FlexItem grow={0}>
            <Field
              name="base"
              component={renderBaseDropdownField}
              onContinue={onContinue}
            />
          </FlexItem>
          <FlexItem grow={1} paddingLeft={3}>
            <BaseAndEducationFieldValue>
              {({ base, education }) =>
                ['copy_koulutus'].includes(base) ? (
                  <>
                    <Spacing marginBottom={2}>
                      <Typography variant="h6" marginBottom={1}>
                        Valitse koulutus
                      </Typography>
                      <Field
                        name="education"
                        options={getKoulutusOptions(koulutukset || [])}
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
