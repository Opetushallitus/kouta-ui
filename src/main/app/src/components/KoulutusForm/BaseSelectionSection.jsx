import React from 'react';
import styled from 'styled-components';
import { Field } from 'redux-form';
import { formValues } from 'redux-form';

import Button from '../Button';
import DropdownIcon from '../DropdownIcon';

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
import useTranslation from '../useTranslation';

const DropdownButton = styled(Button)`
  display: inline-flex;
`;

const BaseAndEducationFieldValue = formValues({
  base: 'base',
  education: 'education',
})(({ base, education, children }) => children({ base, education }));

const renderBaseDropdownField = ({ input, onContinue, onCreateNew, t }) => {
  const { onChange } = input;

  return (
    <UncontrolledDropdown
      overlay={
        <DropdownMenu>
          <DropdownMenuItem
            onClick={() => {
              onChange('new_koulutus');
              onCreateNew();
              onContinue();
            }}
          >
            {t('koulutuslomake.luoUusiKoulutus')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChange('copy_koulutus')}>
            {t('koulutuslomake.kopioiPohjaksiKoulutus')}
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

const getKoulutusOptions = koulutukset => {
  return koulutukset.map(({ nimi, oid }) => ({
    value: oid,
    label: getFirstLanguageValue(nimi),
  }));
};

const BaseSelectionSection = ({ onContinue, organisaatioOid, onCreateNew }) => {
  const { t } = useTranslation();

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
              onCreateNew={onCreateNew}
              t={t}
            />
          </FlexItem>
          <FlexItem grow={1} paddingLeft={3}>
            <BaseAndEducationFieldValue>
              {({ base }) =>
                ['copy_koulutus'].includes(base) ? (
                  <>
                    <Spacing marginBottom={2}>
                      <Typography variant="h6" marginBottom={1}>
                        {t('yleiset.valitseKoulutus')}
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
