import React, { useMemo } from 'react';
import { Field, FieldArray, formValues } from 'redux-form';

import Typography from '../Typography';
import Spacing from '../Spacing';
import Checkbox from '../Checkbox';
import Button from '../Button';
import { isArray, formatKoutaDateString, getTestIdProps } from '../../utils';
import useTranslation from '../useTranslation';
import Flex, { FlexItem } from '../Flex';
import { FormFieldDateTimeInput } from '../FormFields';

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

  return hakuajat.length === 0 ? (
    <Typography variant="secondary">
      {t('hakukohdelomake.haullaEiHakuaikaa')}
    </Typography>
  ) : (
    hakuajat.map(([start, end], index) => (
      <Typography
        variant="div"
        marginBottom={index < hakuajat.length - 1 ? 1 : 0}
        key={index}
      >
        {start} - {end}
      </Typography>
    ))
  );
};

const renderCheckboxField = ({ input, label = null }) => (
  <Checkbox
    checked={input.value}
    onChange={input.onChange}
    name="eriHakuaika"
    children={label}
  />
);

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

const EriHakuaikaFieldValue = formValues(({ name }) => ({
  eriHakuaika: `${name}.eriHakuaika`,
}))(({ eriHakuaika, children }) => children({ eriHakuaika }));

const HakuajatSection = ({ haku, name }) => {
  const { t } = useTranslation();

  return (
    <>
      <Spacing marginBottom={2}>
        <Typography variant="h6" marginBottom={1}>
          {t('hakukohdelomake.hakuunLiitetytHakuajat')}
        </Typography>
        <HakuaikaInterval haku={haku} />
      </Spacing>
      <Field
        name={`${name}.eriHakuaika`}
        component={renderCheckboxField}
        label={t('hakukohdelomake.hakukohteellaEriHakuaika')}
      />
      <EriHakuaikaFieldValue name={name}>
        {({ eriHakuaika }) =>
          eriHakuaika ? <CustomHakuaika name={name} /> : null
        }
      </EriHakuaikaFieldValue>
    </>
  );
};

export default HakuajatSection;
