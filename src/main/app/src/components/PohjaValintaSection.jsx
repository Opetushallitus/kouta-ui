import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';
import { getFirstLanguageValue } from '#/src/utils';
import { POHJAVALINTA } from '#/src/constants';
import {
  FormFieldSelect,
  FormFieldRadioGroup,
} from '#/src/components/formFields';
import FormControl from '#/src/components/FormControl';
import Spacing from '#/src/components/Spacing';
import Typography from '#/src/components/Typography';
import useApiAsync from '#/src/components/useApiAsync';

const getCopyOptions = koulutukset => {
  return koulutukset.map(({ nimi, oid }) => ({
    value: oid,
    label: getFirstLanguageValue(nimi),
  }));
};

const CopySelect = ({ input: { value }, options, selectName }) => {
  return value === POHJAVALINTA.KOPIO ? (
    <Spacing marginTop={2} marginBottom={2}>
      <Field name={selectName} component={FormFieldSelect} options={options} />
    </Spacing>
  ) : null;
};

export default function PohjaValintaSection({
  organisaatioOid,
  getCopyEntities,
  name,
  disabled,
  infoText,
  copyLabel,
  createLabel,
}) {
  const { t } = useTranslation();

  const { data = [] } = useApiAsync({
    promiseFn: getCopyEntities,
    organisaatioOid,
    watch: organisaatioOid,
  });

  const tapaName = `${name}.tapa`;
  const valintaName = `${name}.valinta`;

  const tapaOptions = [
    {
      label: createLabel,
      value: POHJAVALINTA.UUSI,
    },
    {
      label: copyLabel,
      value: POHJAVALINTA.KOPIO,
    },
  ];

  const copyOptions = useMemo(() => getCopyOptions(data), [data]);

  return (
    <>
      {infoText && (
        <Typography variant="secondary" as="div" marginBottom={2}>
          {infoText}
        </Typography>
      )}
      <FormControl>
        <Field
          name={tapaName}
          component={FormFieldRadioGroup}
          options={tapaOptions}
          label={t('yleiset.valitseLomakkeenPohja')}
          disabled={disabled}
        />

        <Field
          name={tapaName}
          options={copyOptions}
          selectName={valintaName}
          component={CopySelect}
          disabled={disabled}
        />
      </FormControl>
    </>
  );
}
