import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import Button from '#/src/components/Button';
import { Flex, FlexItem } from '#/src/components/Flex';
import { FormFieldSelect } from '#/src/components/formFields';
import Modal from '#/src/components/Modal';
import Spacing from '#/src/components/Spacing';
import { useFieldValue } from '#/src/hooks/form';
import useApiAsync from '#/src/hooks/useApiAsync';
import useEntityOptions from '#/src/hooks/useEntityOptionsHook';
import getToteutukset from '#/src/utils/toteutus/getToteutukset';

const HakukohteetModal = ({
  onClose,
  organisaatioOid,
  fieldName = 'hakukohteet',
  onSave: onSaveProp = x => {},
  ...props
}) => {
  const { t } = useTranslation();
  const toteutus = useFieldValue(`${fieldName}.toteutus`);

  const { data: toteutukset } = useApiAsync({
    promiseFn: getToteutukset,
    organisaatioOid,
    watch: organisaatioOid,
  });

  const onSave = useCallback(() => {
    return onSaveProp({ toteutusOid: toteutus.value });
  }, [onSaveProp, toteutus]);

  const toteutuksetOptions = useEntityOptions(toteutukset);

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
              configurable={false}
            />
          </Spacing>
        </FlexItem>
      </Flex>
    </Modal>
  );
};

export default HakukohteetModal;
