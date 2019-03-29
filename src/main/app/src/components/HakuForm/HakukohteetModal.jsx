import React, { useMemo } from 'react';
import { Field, formValues } from 'redux-form';

import Modal from '../Modal';
import Button from '../Button';
import { getKoutaToteutukset } from '../../apiUtils';
import Flex, { FlexItem } from '../Flex';
import Select from '../Select';
import { getFirstLanguageValue, noop } from '../../utils';
import Spacing from '../Spacing';
import Typography from '../Typography';
import useApiAsync from '../useApiAsync';
import useTranslation from '../useTranslation';

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

const FooterField = formValues('toteutus')(({ toteutus, children }) =>
  children({ toteutus }),
);

const HakukohteetModal = ({
  onClose,
  organisaatioOid,
  pohjaValue,
  fieldName = 'toteutukset',
  onSave = () => {},
  ...props
}) => {
  const { t } = useTranslation();

  const { data: toteutukset } = useApiAsync({
    promiseFn: getKoutaToteutukset,
    organisaatioOid,
    watch: organisaatioOid,
  });

  const toteutuksetOptions = useMemo(() => {
    return toteutukset ? getToteutusOptions(toteutukset) : [];
  }, [toteutukset]);

  return (
    <Modal
      minHeight="200px"
      header={t('yleiset.liitaHakukohde')}
      footer={
        <FooterField>
          {({ toteutus }) => (
            <Flex justifyBetween>
              <Button onClick={onClose} variant="outlined" type="button" />
              <Button onClick={onSave} type="button" disabled={!toteutus}>
                {t('yleiset.luoUusiHakukohde')}
              </Button>
            </Flex>
          )}
        </FooterField>
      }
      onClose={onClose}
      {...props}
    >
      <Flex>
        <FlexItem grow={2}>
          <Spacing marginBottom={2}>
            <Typography variant="h6" marginBottom={1}>
              {t('yleiset.valitseToteutus')}
            </Typography>
            <Field
              name="toteutus"
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
