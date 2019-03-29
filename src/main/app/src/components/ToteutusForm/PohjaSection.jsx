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

import DropdownIcon from '../DropdownIcon';
import Typography from '../Typography';
import Select from '../Select';
import ApiAsync from '../ApiAsync';
import { getKoutaToteutukset } from '../../apiUtils';
import Flex, { FlexItem } from '../Flex';
import { getFirstLanguageValue } from '../../utils';
import useTranslation from '../useTranslation';

const DropdownButton = styled(Button)`
  display: inline-flex;
`;

const PohjaFieldValue = formValues({
  pohja: 'pohja',
})(({ pohja, children }) => children({ pohja }));

const renderBaseDropdownField = ({ input, onContinue, onCreateNew, t }) => {
  const { onChange } = input;

  return (
    <UncontrolledDropdown
      overlay={
        <DropdownMenu>
          <DropdownMenuItem
            onClick={() => {
              onChange('new_toteutus');
              onCreateNew();
              onContinue();
            }}
          >
            {t('yleiset.luoUusiToteutus')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChange('copy_toteutus')}>
            {t('yleiset.kopioiPohjaksiToteutus')}
          </DropdownMenuItem>
        </DropdownMenu>
      }
    >
      {({ ref, onToggle, visible }) => (
        <div ref={ref} style={{ display: 'inline-block' }}>
          <DropdownButton onClick={onToggle} type="button">
            {t('yleiset.valitsePohja')} <DropdownIcon open={visible} />
          </DropdownButton>
        </div>
      )}
    </UncontrolledDropdown>
  );
};

const noop = () => {};

const renderSelectField = ({ options = [], input }) => (
  <Select {...input} options={options} onBlur={noop} />
);

const getToteutusOptions = toteutukset => {
  return toteutukset.map(({ nimi, oid }) => ({
    value: oid,
    label: getFirstLanguageValue(nimi),
  }));
};

const PohjaSection = ({ organisaatioOid, onContinue, onCreateNew }) => {
  const { t } = useTranslation();

  return (
    <ApiAsync
      promiseFn={getKoutaToteutukset}
      organisaatioOid={organisaatioOid}
      watch={organisaatioOid}
    >
      {({ data: koulutukset }) => (
        <Flex>
          <FlexItem grow={0}>
            <Field
              name="pohja"
              component={renderBaseDropdownField}
              onContinue={onContinue}
              onCreateNew={onCreateNew}
              t={t}
            />
          </FlexItem>
          <FlexItem grow={1} paddingLeft={3}>
            <PohjaFieldValue>
              {({ pohja }) =>
                ['copy_toteutus'].includes(pohja) ? (
                  <>
                    <Typography variant="h6" marginBottom={1}>
                      {t('yleiset.valitseToteutus')}
                    </Typography>
                    <Field
                      name="toteutus"
                      options={getToteutusOptions(koulutukset || [])}
                      component={renderSelectField}
                    />
                  </>
                ) : null
              }
            </PohjaFieldValue>
          </FlexItem>
        </Flex>
      )}
    </ApiAsync>
  );
};

export default PohjaSection;
