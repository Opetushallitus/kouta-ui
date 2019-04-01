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
import ApiAsync from '../ApiAsync';
import { getKoutaHaut } from '../../apiUtils';
import Flex, { FlexItem } from '../Flex';
import Spacing from '../Spacing';
import { getFirstLanguageValue } from '../../utils';
import useTranslation from '../useTranslation';
import DropdownIcon from '../DropdownIcon';

const DropdownButton = styled(Button)`
  display: inline-flex;
`;

const BaseAndSearchFieldValue = formValues({
  base: 'base',
})(({ base, children }) => children({ base }));

const renderBaseDropdownField = ({ input, onContinue, onCreateNew, t }) => {
  const { onChange } = input;

  return (
    <UncontrolledDropdown
      overlay={
        <DropdownMenu>
          <DropdownMenuItem
            onClick={() => {
              onChange('new_haku');
              onCreateNew();
              onContinue();
            }}
          >
            {t('hakulomake.luoUusiHaku')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChange('copy_haku')}>
            {t('hakulomake.kopioiPohjaksiHaku')}
          </DropdownMenuItem>
        </DropdownMenu>
      }
    >
      {({ ref, onToggle, visible }) => (
        <div ref={ref}>
          <DropdownButton onClick={onToggle} type="button">
            {t('yleiset.valitsePohja')} <DropdownIcon open={visible} />
          </DropdownButton>
        </div>
      )}
    </UncontrolledDropdown>
  );
};

const nop = () => {};

const renderSelectField = ({ options = [], input }) => {
  return <Select {...input} options={options} onBlur={nop} />;
};

const getHakuOptions = haut => {
  return haut.map(({ nimi, oid }) => ({
    value: oid,
    label: getFirstLanguageValue(nimi),
  }));
};

const BaseSelectionSection = ({ organisaatioOid, onContinue, onCreateNew }) => {
  const { t } = useTranslation();

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
              onContinue={onContinue}
              onCreateNew={onCreateNew}
              t={t}
            />
          </FlexItem>
          <FlexItem grow={1} paddingLeft={3}>
            <BaseAndSearchFieldValue>
              {({ base }) =>
                ['copy_haku'].includes(base) ? (
                  <>
                    <Spacing marginBottom={2}>
                      <Typography variant="h6" marginBottom={1}>
                        {t('yleiset.valitseHaku')}
                      </Typography>
                      <Field
                        name="search"
                        options={getHakuOptions(haut || [])}
                        component={renderSelectField}
                      />
                    </Spacing>
                  </>
                ) : null
              }
            </BaseAndSearchFieldValue>
          </FlexItem>
        </Flex>
      )}
    </ApiAsync>
  );
};

export default BaseSelectionSection;
