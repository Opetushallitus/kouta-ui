import React, { useMemo } from 'react';
import { Field, formValues } from 'redux-form';

import Modal from '../Modal';
import Button from '../Button';
import { getKoutaToteutukset } from '../../apiUtils';
import Flex, { FlexItem } from '../Flex';
import Select from '../Select';
import { getFirstLanguageValue } from '../../utils';
import Spacing from '../Spacing';
import Typography from '../Typography';
import useApiAsync from '../useApiAsync';

const noop = () => {};

const getToteutusOptions = toteutukset => {
  return toteutukset.map(({ nimi, oid }) => ({
    value: oid,
    label: getFirstLanguageValue(nimi),
  }));
};

const renderSelectField = ({ options = [], input }) => {
  return (
    <Select
      {...input}
      options={options}
      onBlur={noop}
      menuPortalTarget={document.body}
      menuPosition="fixed"
    />
  );
};

const HakukohteetModal = ({
  onClose,
  organisaatioOid,
  pohjaValue,
  fieldName = 'toteutukset',
  onSave = () => {},
  ...props
}) => {
  const { data: toteutukset } = useApiAsync({
    promiseFn: getKoutaToteutukset,
    organisaatioOid,
    watch: organisaatioOid,
  });

  const FooterField = formValues('toteutus')(
    ({ toteutus, children }) => children({ toteutus }),
  );

  const getState = (toteutus) => {
    return toteutus ? true : false;
  };

  const toteutuksetOptions = useMemo(() => {
    return toteutukset ? getToteutusOptions(toteutukset) : [];
  }, [toteutukset]);

  return (

    <Modal
      minHeight="200px"
      header="Hakukohteen liittäminen hakuun"
      footer={
        <FooterField>
          {({ toteutus }) =>
          <Flex justifyBetween>
            <Button onClick={onClose} variant="outlined" type="button">
              Sulje
            </Button>
            <Button onClick={onSave} type="button" disabled={!getState(toteutus)}>
              Luo uusi hakukohde
            </Button>
          </Flex>
          }
        </FooterField>
      }
      onClose={onClose}
      {...props}
    >
      <Flex>        
        <FlexItem grow={2}>
          <Spacing marginBottom={2}>
            <Typography variant="h6" marginBottom={1}>
              Valitse ensin toteutus
            </Typography>
            <Field
              name='toteutus'
              options={toteutuksetOptions}
              component={renderSelectField}
            />
          </Spacing>
        </FlexItem>
      </Flex>
    </Modal>
  );
};

export default HakukohteetModal;
