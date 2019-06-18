import React, { useMemo } from 'react';
import { Field } from 'redux-form';

import Modal from '../Modal';
import Button from '../Button';
import { getKoutaHaut } from '../../apiUtils';
import Flex from '../Flex';
import { getFirstLanguageValue } from '../../utils';
import useApiAsync from '../useApiAsync';
import useTranslation from '../useTranslation';
import { FormFieldSelect } from '../FormFields';
import useFieldValue from '../useFieldValue';

const getOptions = items => {
  return items.map(({ nimi, oid }) => ({
    value: oid,
    label: getFirstLanguageValue(nimi),
  }));
};

const HakukohteetModal = ({
  onClose,
  organisaatioOid,
  fieldName = 'hakukohteet',
  onSave = () => {},
  ...props
}) => {
  const { t } = useTranslation();
  const hakuValue = useFieldValue(`${fieldName}.haku`);

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
            {t('yleiset.sulje')}
          </Button>
          <Button onClick={onSave} type="button" disabled={!hakuValue}>
            {t('yleiset.liitaHakukohde')}
          </Button>
        </Flex>
      }
      onClose={onClose}
      {...props}
    >
      <Field
        name={`${fieldName}.haku`}
        options={hautOptions}
        component={FormFieldSelect}
        menuPortalTarget={document.body}
        menuPosition="fixed"
        label={t('yleiset.valitseHaku')}
      />
    </Modal>
  );
};

export default HakukohteetModal;
