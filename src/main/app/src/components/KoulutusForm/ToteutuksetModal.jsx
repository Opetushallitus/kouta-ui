import React from 'react';
import { Field } from 'redux-form';
import styled from 'styled-components';

import Modal from '../Modal';
import Button from '../Button';
import { getKoutaToteutukset } from '../../apiUtils';
import Flex, { FlexItem } from '../Flex';
import Select from '../Select';
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownMenuItem,
} from '../Dropdown';
import Icon from '../Icon';
import { getFirstLanguageValue } from '../../utils';
import Spacing from '../Spacing';
import Typography from '../Typography';
import ApiAsync from '../ApiAsync';

const DropdownButton = styled(Button)`
  display: inline-flex;
`;

const renderBaseDropdownField = ({ input }) => {
  const { onChange } = input;

  return (
    <UncontrolledDropdown
      overlay={
        <DropdownMenu>
          <DropdownMenuItem
            onClick={() => {
              onChange('new_toteutus');
            }}
          >
            Luo uusi toteutus
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChange('copy_toteutus')}>
            Kopio pohjaksi aiemmin luotu toteutus
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

const noop = () => {};

const getToteutusOptions = toteutukset => {
  return toteutukset.map(({ nimi, oid }) => ({
    value: oid,
    label: getFirstLanguageValue(nimi),
  }));
};

const renderSelectField = ({ options = [], input }) => {
  return <Select {...input} options={options} onBlur={noop} />;
};

const ToteutuksetModal = ({
  onClose,
  organisaatioOid,
  pohjaValue,
  fieldName = 'toteutukset',
  onSave = () => {},
  ...props
}) => {
  return (
    <Modal
      minHeight="200px"
      header="Toteutuksen liittäminen koulutukseen"
      footer={
        <Flex justifyBetween>
          <Button onClick={onClose} variant="outlined" type="button">Sulje</Button>
          <Button onClick={onSave} type="button">Tallenna ja liitä toteutus</Button>
        </Flex>
      }
      onClose={onClose}
      {...props}
    >
      <ApiAsync
        promiseFn={getKoutaToteutukset}
        organisaatioOid={organisaatioOid}
        watch={organisaatioOid}
      >
        {({ data: toteutukset }) => (
          <Flex>
            <FlexItem grow={0}>
              <Field
                name={`${fieldName}.pohja`}
                component={renderBaseDropdownField}
              />
            </FlexItem>
            <FlexItem grow={1} paddingLeft={3}>
              {['copy_toteutus'].includes(pohjaValue) ? (
                <>
                  <Spacing marginBottom={2}>
                    <Typography variant="h6" marginBottom={1}>
                      Valitse toteutus
                    </Typography>
                    <Field
                      name={`${fieldName}.toteutus`}
                      options={getToteutusOptions(toteutukset || [])}
                      component={renderSelectField}
                    />
                  </Spacing>
                </>
              ) : null}
            </FlexItem>
          </Flex>
        )}
      </ApiAsync>
    </Modal>
  );
};

export default ToteutuksetModal;
