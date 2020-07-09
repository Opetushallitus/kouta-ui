import React, { useMemo, useCallback } from 'react';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';

import Modal from '#/src/components/Modal';
import Button from '#/src/components/Button';
import getHaut from '#/src/utils/haku/getHaut';
import Flex from '#/src/components/Flex';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import useApiAsync from '#/src/hooks/useApiAsync';
import { FormFieldSelect } from '#/src/components/formFields';
import { useFieldValue } from '#/src/hooks/form';

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
  onSave: onSaveProp = () => {},
  ...props
}) => {
  const { t } = useTranslation();
  const hakuValue = useFieldValue(`${fieldName}.haku`);

  const { data: haut } = useApiAsync({
    promiseFn: getHaut,
    organisaatioOid,
    watch: organisaatioOid,
  });

  const onSave = useCallback(() => {
    return onSaveProp({ hakuOid: hakuValue.value });
  }, [onSaveProp, hakuValue]);

  const hautOptions = useMemo(() => {
    return haut ? getOptions(haut) : [];
  }, [haut]);

  return (
    <Modal
      minHeight="200px"
      header={t('toteutuslomake.hakukohteenLiittaminen')}
      footer={
        <Flex justifyBetween>
          <Button onClick={onClose} variant="outlined" type="button">
            {t('yleiset.sulje')}
          </Button>
          <Button onClick={onSave} type="button" disabled={!hakuValue}>
            {t('yleiset.lisaaHakukohde')}
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
        configurable={false}
      />
    </Modal>
  );
};

export default HakukohteetModal;
