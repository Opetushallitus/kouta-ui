import React, { useMemo, useCallback } from 'react';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';

import Modal from '#/src/components/Modal';
import Button from '#/src/components/Button';
import getToteutukset from '#/src/utils/toteutus/getToteutukset';
import Flex, { FlexItem } from '#/src/components/Flex';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import Spacing from '#/src/components/Spacing';
import useApiAsync from '#/src/hooks/useApiAsync';
import { FormFieldSelect } from '#/src/components/formFields';
import { useFieldValue } from '#/src/hooks/form';

const getToteutusOptions = toteutukset => {
  return toteutukset.map(({ nimi, oid, tila }) => ({
    value: oid,
    label: getFirstLanguageValue(nimi) + ` (${tila})`,
  }));
};

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
              configurable={false}
            />
          </Spacing>
        </FlexItem>
      </Flex>
    </Modal>
  );
};

export default HakukohteetModal;
