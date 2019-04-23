import React, { Fragment } from 'react';
import { Field, FieldArray, formValues } from 'redux-form';

import Spacing from '../Spacing';
import Button from '../Button';
import Flex, { FlexItem } from '../Flex';
import Divider from '../Divider';
import { getTestIdProps } from '../../utils';
import useKoodistoOptions from '../useKoodistoOptions';
import useTranslation from '../useTranslation';

import {
  FormFieldDateTimeInput,
  FormFieldInput,
  FormFieldSelect,
  FormFieldTextarea,
  FormFieldCheckbox,
} from '../FormFields';

const ToimitusaikaSection = ({ getFieldName }) => {
  const { t } = useTranslation();

  return (
    <Field
      name={getFieldName('toimitusaika')}
      component={FormFieldDateTimeInput}
      label={t('hakukohdelomake.toimitusaika')}
      helperText={t('yleiset.paivamaaraJaKellonaika')}
    />
  );
};

const ToimituspaikkaSection = ({ getFieldName, language }) => {
  const { t } = useTranslation();

  return (
    <>
      <Spacing marginBottom={2} {...getTestIdProps('osoite')}>
        <Field
          name={`${getFieldName('toimitusosoite')}.${language}`}
          component={FormFieldInput}
          label={t('yleiset.osoite')}
        />
      </Spacing>

      <Spacing marginBottom={2}>
        <Flex>
          <FlexItem grow={0} basis="30%" {...getTestIdProps('postinumero')}>
            <Field
              name={getFieldName('toimituspostinumero')}
              component={FormFieldInput}
              type="number"
              label={t('yleiset.postinumero')}
            />
          </FlexItem>
          <FlexItem
            grow={1}
            paddingLeft={2}
            {...getTestIdProps('postitoimipaikka')}
          >
            <Field
              name={`${getFieldName('toimituspostitoimipaikka')}.${language}`}
              component={FormFieldInput}
              label={t('yleiset.postitoimipaikka')}
            />
          </FlexItem>
        </Flex>
      </Spacing>

      <Spacing {...getTestIdProps('sahkoposti')}>
        <Field
          name={getFieldName('toimitussahkoposti')}
          component={FormFieldInput}
          type="email"
          label={t('yleiset.sahkoposti')}
        />
      </Spacing>
    </>
  );
};

const renderLiitteetFields = ({
  fields,
  language,
  includeToimitusaika = true,
  includeToimituspaikka = true,
  tyyppiOptions,
  t,
}) => {
  return (
    <>
      {fields.map((liite, index) => (
        <Fragment key={index}>
          <Spacing marginBottom={2} {...getTestIdProps('tyyppi')}>
            <Field
              name={`${liite}.tyyppi`}
              component={FormFieldSelect}
              options={tyyppiOptions}
              label={t('yleiset.tyyppi')}
            />
          </Spacing>

          <Spacing marginBottom={2} {...getTestIdProps('nimi')}>
            <Field
              name={`${liite}.nimi.${language}`}
              component={FormFieldInput}
              label={t('yleiset.nimi')}
            />
          </Spacing>

          <Spacing marginBottom={2} {...getTestIdProps('kuvaus')}>
            <Field
              name={`${liite}.kuvaus.${language}`}
              component={FormFieldTextarea}
              label={t('yleiset.kuvaus')}
            />
          </Spacing>

          {includeToimitusaika ? (
            <Spacing marginBottom={2} {...getTestIdProps('toimitusaika')}>
              <ToimitusaikaSection
                getFieldName={baseName => `${liite}.${baseName}`}
              />
            </Spacing>
          ) : null}

          {includeToimituspaikka ? (
            <Spacing marginBottom={2} {...getTestIdProps('toimituspaikka')}>
              <ToimituspaikkaSection
                language={language}
                getFieldName={baseName => `${liite}.${baseName}`}
              />
            </Spacing>
          ) : null}

          <Flex justifyEnd>
            <Button
              type="button"
              onClick={() => {
                fields.remove(index);
              }}
              variant="outlined"
              color="secondary"
            >
              {t('yleiset.poista')}
            </Button>
          </Flex>
          <Divider marginTop={3} marginBottom={3} />
        </Fragment>
      ))}
      <Button
        type="button"
        onClick={() => {
          fields.push({});
        }}
        {...getTestIdProps('lisaaButton')}
      >
        {t('hakukohdelomake.lisaaLiite')}
      </Button>
    </>
  );
};

const YhteinenToimitusFieldValues = formValues({
  yhteinenToimitusaika: 'yhteinenToimitusaika',
  yhteinenToimituspaikka: 'yhteinenToimituspaikka',
})(({ yhteinenToimitusaika, yhteinenToimituspaikka, children }) =>
  children({
    yhteinenToimitusaika,
    yhteinenToimituspaikka,
  }),
);

const LiitteetSection = ({ language, organisaatioOid }) => {
  const { options: tyyppiOptions } = useKoodistoOptions({
    koodisto: 'liitetyypitamm',
  });

  const { t } = useTranslation();

  return (
    <YhteinenToimitusFieldValues>
      {({ yhteinenToimitusaika, yhteinenToimituspaikka }) => (
        <>
          <Spacing marginBottom={2} {...getTestIdProps('liitelista')}>
            <FieldArray
              name="liitteet"
              component={renderLiitteetFields}
              language={language}
              includeToimitusaika={!yhteinenToimitusaika}
              includeToimituspaikka={!yhteinenToimituspaikka}
              tyyppiOptions={tyyppiOptions}
              t={t}
            />
          </Spacing>
          <Spacing>
            <Field name="yhteinenToimitusaika" component={FormFieldCheckbox}>
              {t('hakukohdelomake.kaytaLiitteilleYhteistaToimitusaikaa')}
            </Field>
            {yhteinenToimitusaika ? (
              <Spacing marginTop={1} marginBottom={2}>
                <ToimitusaikaSection getFieldName={baseName => baseName} />
              </Spacing>
            ) : null}
          </Spacing>
          <Spacing>
            <Field name="yhteinenToimituspaikka" component={FormFieldCheckbox}>
              {t('hakukohdelomake.kaytaLiitteilleYhteistaToimituspaikkaa')}
            </Field>
            {yhteinenToimituspaikka ? (
              <Spacing marginTop={1}>
                <ToimituspaikkaSection
                  getFieldName={baseName => baseName}
                  language={language}
                />
              </Spacing>
            ) : null}
          </Spacing>
        </>
      )}
    </YhteinenToimitusFieldValues>
  );
};

export default LiitteetSection;
