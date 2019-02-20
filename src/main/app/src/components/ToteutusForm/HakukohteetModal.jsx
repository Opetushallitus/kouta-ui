import React, { useMemo } from 'react';
import { Field } from 'redux-form';

import Modal from '../Modal';
import Button from '../Button';
import { getKoutaHaut } from '../../apiUtils';
import Flex from '../Flex';
import Select from '../Select';
import { getFirstLanguageValue } from '../../utils';
import Typography from '../Typography';
import useApiAsync from '../useApiAsync';

const noop = () => {};

const getOptions = items => {
  return items.map(({ nimi, oid }) => ({
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
  hakuValue,
  fieldName = 'hakukohteet',
  onSave = () => {},
  ...props
}) => {
  const { data: haut } = useApiAsync({
    promiseFn: getKoutaHaut,
    organisaatioOid,
    watch: organisaatioOid,
  });

  const hautOptions = useMemo(() => {
    return haut ? getOptions(haut) : [];
  }, [haut]);

  return (
    <Modal
      minHeight="200px"
      header="Hakukohteen liittäminen toteutukseen"
      footer={
        <Flex justifyBetween>
          <Button onClick={onClose} variant="outlined" type="button">
            Sulje
          </Button>
          <Button onClick={onSave} type="button" disabled={!hakuValue}>
            Liitä hakukohde
          </Button>
        </Flex>
      }
      onClose={onClose}
      {...props}
    >
      <Typography variant="h6" marginBottom={1}>
        Valitse haku
      </Typography>
      <Field
        name={`${fieldName}.haku`}
        options={hautOptions}
        component={renderSelectField}
      />
    </Modal>
  );
};

export default HakukohteetModal;
