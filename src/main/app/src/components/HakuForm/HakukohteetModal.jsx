import React, { useMemo, useCallback } from 'react';
import { Field } from 'redux-form';

import Modal from '../Modal';
import Button from '../Button';
import { getKoutaToteutukset } from '../../apiUtils';
import Flex, { FlexItem } from '../Flex';
import { getFirstLanguageValue } from '../../utils';
import Spacing from '../Spacing';
import useApiAsync from '../useApiAsync';
import useTranslation from '../useTranslation';
import { FormFieldSelect } from '../FormFields';
import useFieldValue from '../useFieldValue';

const getToteutusOptions = toteutukset => {
  return toteutukset.map(({ nimi, oid }) => ({
    value: oid,
    label: getFirstLanguageValue(nimi),
  }));
};

const HakukohteetModal = ({
  onClose,
  organisaatioOid,
  fieldName = 'hakukohteet',
  onSave: onSaveProp = () => {},
  ...props
}) => {
  const { t } = useTranslation();
  const toteutus = useFieldValue(`${fieldName}.toteutus`);

  const { data: toteutukset } = useApiAsync({
    promiseFn: getKoutaToteutukset,
    organisaatioOid,
    watch: organisaatioOid,
  });

  const onSave = useCallback(() => {
    return onSaveProp({ toteutusOid: toteutus.value });
  }, [onSaveProp, toteutus]);

  const toteutuksetOptions = useMemo(() => {
    return toteutukset ? getToteutusOptions(toteutukset) : [];
  }, [toteutukset]);

  return (
    <Modal
      minHeight="200px"
      header={t('yleiset.liitaHakukohde')}
      footer={
        <Flex justifyBetween>
          <Button onClick={onClose} variant="outlined" type="button">
            {t('yleiset.sulje')}
          </Button>
          <Button onClick={onSave} type="button" disabled={!toteutus}>
            {t('yleiset.luoUusiHakukohde')}
          </Button>
        </Flex>
      }
      onClose={onClose}
      {...props}
    >
      <Flex>
        <FlexItem grow={2}>
          <Spacing marginBottom={2}>
            <Field
              name={`${fieldName}.toteutus`}
              options={toteutuksetOptions}
              component={FormFieldSelect}
              menuPortalTarget={document.body}
              menuPosition="fixed"
              label={t('yleiset.valitseToteutus')}
            />
          </Spacing>
        </FlexItem>
      </Flex>
    </Modal>
  );
};

export default HakukohteetModal;
