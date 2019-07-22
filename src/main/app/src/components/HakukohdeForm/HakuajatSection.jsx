import React, { useMemo } from 'react';
import { Field, FieldArray } from 'redux-form';

import Typography from '../Typography';
import Spacing from '../Spacing';
import Button from '../Button';
import { isArray, formatKoutaDateString, getTestIdProps } from '../../utils';
import useTranslation from '../useTranslation';
import Flex, { FlexItem } from '../Flex';
import { FormFieldDateTimeInput, FormFieldCheckbox } from '../FormFields';
import useFieldValue from '../useFieldValue';

const HakuaikaInterval = ({ haku }) => {
  const dateFormat = 'DD.MM.YYYY HH:mm';
  const { t } = useTranslation();

  const hakuajat = useMemo(
    () =>
      (haku && isArray(haku.hakuajat) ? haku.hakuajat : []).map(
        ({ alkaa, paattyy }) => [
          formatKoutaDateString(alkaa, dateFormat),
          formatKoutaDateString(paattyy, dateFormat),
        ],
      ),
    [haku],
  );

  const hakuajatContent = useMemo(
    () => hakuajat.map(([start, end]) => `${start} - ${end}`).join(', '),
    [hakuajat],
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

const renderHakuajatFields = ({ fields, t }) => (
  <>
    {fields.map((hakuaika, index) => (
      <Flex key={index} marginBottom={2} alignCenter>
        <FlexItem grow={1} paddingRight={2} {...getTestIdProps('alkaa')}>
          <Field
            name={`${hakuaika}.alkaa`}
            component={FormFieldDateTimeInput}
            label={t('yleiset.alkaa')}
            helperText={t('yleiset.paivamaaraJaKellonaika')}
          />
        </FlexItem>
        <FlexItem grow={1} paddingLeft={2} {...getTestIdProps('paattyy')}>
          <Field
            name={`${hakuaika}.paattyy`}
            component={FormFieldDateTimeInput}
            label={t('yleiset.paattyy')}
            helperText={t('yleiset.paivamaaraJaKellonaika')}
          />
        </FlexItem>
        <FlexItem grow={0} paddingLeft={2}>
          <Button
            onClick={() => fields.remove(index)}
            variant="outlined"
            color="secondary"
          >
            {t('yleiset.poista')}
          </Button>
        </FlexItem>
      </Flex>
    ))}
    <Button
      type="button"
      variant="outlined"
      onClick={() => {
        fields.push({});
      }}
      {...getTestIdProps('lisaaButton')}
    >
      {t('yleiset.lisaaHakuaika')}
    </Button>
  </>
);

const CustomHakuaika = ({ name }) => {
  const { t } = useTranslation();

  return (
    <Spacing marginTop={2}>
      <FieldArray
        name={`${name}.hakuajat`}
        component={renderHakuajatFields}
        t={t}
      />
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
