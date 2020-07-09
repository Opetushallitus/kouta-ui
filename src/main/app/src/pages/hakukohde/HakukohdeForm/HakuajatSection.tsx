import React, { useMemo } from 'react';
import { Field, FieldArray } from 'redux-form';
import { isArray } from 'lodash';
import { useTranslation } from 'react-i18next';

import Typography from '#/src/components/Typography';
import Spacing from '#/src/components/Spacing';
import { formatKoutaDateString } from '#/src/utils';
import { FormFieldCheckbox } from '#/src/components/formFields';
import { useFieldValue } from '#/src/hooks/form';
import HakuajatFields from '#/src/components/HakuajatFields';

const HakuaikaInterval = ({ haku }) => {
  const dateFormat = 'DD.MM.YYYY HH:mm';
  const { t } = useTranslation();

  const hakuajat = useMemo(
    () =>
      (haku && isArray(haku.hakuajat)
        ? haku.hakuajat
        : []
      ).map(({ alkaa, paattyy }) => [
        formatKoutaDateString(alkaa, dateFormat),
        formatKoutaDateString(paattyy, dateFormat),
      ]),
    [haku]
  );

  const hakuajatContent = useMemo(
    () => hakuajat.map(([start, end]) => `${start} - ${end}`).join(', '),
    [hakuajat]
  );

  return hakuajat.length === 0 ? (
    <Typography>{t('hakukohdelomake.haullaEiHakuaikaa')}</Typography>
  ) : (
    <Typography>
      {t('hakukohdelomake.hakuunLiitetytHakuajat')}:{' '}
      <strong>{hakuajatContent}</strong>
    </Typography>
  );
};

const CustomHakuaika = ({ name }) => {
  const { t } = useTranslation();

  return (
    <Spacing marginTop={2}>
      <FieldArray name={`${name}.hakuajat`} component={HakuajatFields} t={t} />
    </Spacing>
  );
};

const HakuajatSection = ({ haku, name }) => {
  const { t } = useTranslation();
  const eriHakuaika = useFieldValue(`${name}.eriHakuaika`);

  return (
    <>
      <Spacing marginBottom={2}>
        <HakuaikaInterval haku={haku} />
      </Spacing>
      <Field name={`${name}.eriHakuaika`} component={FormFieldCheckbox}>
        {t('hakukohdelomake.hakukohteellaEriHakuaika')}
      </Field>
      {eriHakuaika ? <CustomHakuaika name={name} /> : null}
    </>
  );
};

export default HakuajatSection;
