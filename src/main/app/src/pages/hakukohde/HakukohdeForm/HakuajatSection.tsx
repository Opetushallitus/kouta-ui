import React, { useMemo } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Field, FieldArray } from 'redux-form';

import { FormFieldSwitch } from '#/src/components/formFields';
import { HakuajatFields } from '#/src/components/HakuajatFields';
import { Box, Typography } from '#/src/components/virkailija';
import { NDASH } from '#/src/constants';
import { useFieldValue } from '#/src/hooks/form';
import { formatDateValue } from '#/src/utils';
import isYhteishakuHakutapa from '#/src/utils/isYhteishakuHakutapa';

const HakuaikaInterval = ({ haku }) => {
  const { t } = useTranslation();

  const hakuajat = useMemo(
    () =>
      (haku && _.isArray(haku.hakuajat) ? haku.hakuajat : []).map(
        ({ alkaa, paattyy }) => [
          formatDateValue(alkaa) ?? '',
          formatDateValue(paattyy) ?? '',
        ]
      ),
    [haku]
  );

  const hakuajatContent = useMemo(
    () => hakuajat.map(([start, end]) => `${start} ${NDASH} ${end}`).join(', '),
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
    <Box marginTop={2}>
      <FieldArray name={`${name}.hakuajat`} component={HakuajatFields} t={t} />
    </Box>
  );
};

export const HakuajatSection = ({ haku, name }) => {
  const { t } = useTranslation();
  const eriHakuaika = useFieldValue(`${name}.eriHakuaika`);
  const isYhteishaku = isYhteishakuHakutapa(haku?.hakutapaKoodiUri);

  return (
    <>
      <Box marginBottom={2}>
        <HakuaikaInterval haku={haku} />
      </Box>
      <Field
        name={`${name}.eriHakuaika`}
        component={FormFieldSwitch}
        disabled={isYhteishaku}
      >
        {t('hakukohdelomake.hakukohteellaEriHakuaika')}
      </Field>
      {eriHakuaika ? <CustomHakuaika name={name} /> : null}
    </>
  );
};
