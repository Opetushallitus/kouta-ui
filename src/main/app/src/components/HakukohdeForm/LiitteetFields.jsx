import React, { useMemo } from 'react';
import { Field, FieldArray, Fields } from 'redux-form';
import get from 'lodash/get';

import Spacing from '../Spacing';
import Button from '../Button';
import Flex, { FlexItem } from '../Flex';
import { getTestIdProps } from '../../utils';
import useKoodistoOptions from '../useKoodistoOptions';
import useTranslation from '../useTranslation';
import FieldArrayList from '../FieldArrayList';
import { LIITTEEN_TOIMITUSTAPA } from '../../constants';

import {
  FormFieldDateTimeInput,
  FormFieldInput,
  FormFieldSelect,
  FormFieldTextarea,
  FormFieldCheckbox,
  FormFieldRadioGroup,
} from '../FormFields';

const ToimitusaikaFields = ({ name }) => {
  const { t } = useTranslation();

  return (
    <Field
      name={name}
      component={FormFieldDateTimeInput}
      label={t('hakukohdelomake.toimitusaika')}
      helperText={t('yleiset.paivamaaraJaKellonaika')}
    />
  );
};

const ToimituspaikkaFields = ({ name, language }) => {
  const { t } = useTranslation();

  return (
    <>
      <Spacing marginBottom={2} {...getTestIdProps('osoite')}>
        <Field
          name={`${name}.osoite.${language}`}
          component={FormFieldInput}
          label={t('yleiset.osoite')}
        />
      </Spacing>

      <Spacing marginBottom={2}>
        <Flex>
          <FlexItem grow={0} basis="30%" {...getTestIdProps('postinumero')}>
            <Field
              name={`${name}.postinumero`}
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
              name={`${name}.postitoimipaikka.${language}`}
              component={FormFieldInput}
              label={t('yleiset.postitoimipaikka')}
            />
          </FlexItem>
        </Flex>
      </Spacing>

      <Spacing {...getTestIdProps('sahkoposti')}>
        <Field
          name={`${name}.sahkoposti`}
          component={FormFieldInput}
          type="email"
          label={t('yleiset.sahkoposti')}
        />
      </Spacing>
    </>
  );
};

const ToimitustapaPaikkaFields = ({
  input: { value: toimitustapa },
  baseName,
  language,
  t,
}) => {
  return toimitustapa === 'muu_osoite' ? (
    <Spacing marginTop={2}>
      <ToimituspaikkaFields name={baseName} language={language} />
    </Spacing>
  ) : null;
};

const ToimitustapaFields = ({ name, t, language }) => {
  const options = useMemo(() => {
    return [
      {
        value: LIITTEEN_TOIMITUSTAPA.TOIMITETAAN_LAHETTAMISEN_YHTEYDESSA,
        label: t(
          'liitteenToimitustapaValinnat.toimitetaanLahettamisenYhteydessa',
        ),
      },
      {
        value: LIITTEEN_TOIMITUSTAPA.JARJESTAJAN_OSOITE,
        label: t('liitteenToimitustapaValinnat.jarjestajanOsoite'),
      },
      {
        value: LIITTEEN_TOIMITUSTAPA.MUU_OSOITE,
        label: t('liitteenToimitustapaValinnat.muuOsoite'),
      },
    ];
  }, [t]);

  const toimitustapaName = `${name}.tapa`;

  return (
    <>
      <div {...getTestIdProps('toimitustapa')}>
        <Field
          name={toimitustapaName}
          component={FormFieldRadioGroup}
          options={options}
          label="Valitse liitteen toimitustapa"
        />
      </div>
      <Field
        name={toimitustapaName}
        component={ToimitustapaPaikkaFields}
        language={language}
        baseName={`${name}.paikka`}
        t={t}
      />
    </>
  );
};

const LiitteetListField = ({
  fields,
  language,
  includeToimitusaika = true,
  includeToimituspaikka = true,
  tyyppiOptions,
  t,
}) => {
  return (
    <>
      <FieldArrayList fields={fields}>
        {({ field: liite }) => (
          <>
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

            <Spacing
              marginBottom={
                includeToimitusaika || includeToimituspaikka ? 2 : 0
              }
              {...getTestIdProps('kuvaus')}
            >
              <Field
                name={`${liite}.kuvaus.${language}`}
                component={FormFieldTextarea}
                label={t('yleiset.kuvaus')}
              />
            </Spacing>

            {includeToimitusaika ? (
              <Spacing
                marginBottom={includeToimituspaikka ? 2 : 0}
                {...getTestIdProps('toimitusaika')}
              >
                <ToimitusaikaFields name={`${liite}.toimitusaika`} />
              </Spacing>
            ) : null}

            {includeToimituspaikka ? (
              <ToimitustapaFields
                language={language}
                name={`${liite}.toimitustapa`}
                t={t}
              />
            ) : null}
          </>
        )}
      </FieldArrayList>
      <Flex justifyCenter marginTop={fields.length > 0 ? 4 : 0}>
        <Button
          type="button"
          variant="outlined"
          onClick={() => {
            fields.push({});
          }}
          {...getTestIdProps('lisaaButton')}
        >
          {t('hakukohdelomake.lisaaLiite')}
        </Button>
      </Flex>
    </>
  );
};

const LiitteetField = ({
  language,
  baseName,
  tyyppiOptions,
  t,
  yhteinenToimitusaikaName,
  yhteinenToimituspaikkaName,
  ...props
}) => {
  const yhteinenToimitusaika = Boolean(
    get(props, [baseName, 'yhteinenToimitusaika', 'input', 'value']),
  );

  const yhteinenToimituspaikka = Boolean(
    get(props, [baseName, 'yhteinenToimituspaikka', 'input', 'value']),
  );

  return (
    <>
      <Spacing marginBottom={2} {...getTestIdProps('liitelista')}>
        <FieldArray
          name={`${baseName}.liitteet`}
          component={LiitteetListField}
          language={language}
          includeToimitusaika={!yhteinenToimitusaika}
          includeToimituspaikka={!yhteinenToimituspaikka}
          tyyppiOptions={tyyppiOptions}
          t={t}
        />
      </Spacing>
      <Spacing>
        <Field name={yhteinenToimitusaikaName} component={FormFieldCheckbox}>
          {t('hakukohdelomake.kaytaLiitteilleYhteistaToimitusaikaa')}
        </Field>
        {yhteinenToimitusaika ? (
          <Spacing marginTop={2} marginBottom={2}>
            <ToimitusaikaFields name={`${baseName}.toimitusaika`} />
          </Spacing>
        ) : null}
      </Spacing>
      <Spacing>
        <Field name={yhteinenToimituspaikkaName} component={FormFieldCheckbox}>
          {t('hakukohdelomake.kaytaLiitteilleYhteistaToimituspaikkaa')}
        </Field>
        {yhteinenToimituspaikka ? (
          <Spacing marginTop={2}>
            <ToimitustapaFields
              language={language}
              name={`${baseName}.toimitustapa`}
              t={t}
            />
          </Spacing>
        ) : null}
      </Spacing>
    </>
  );
};

const LiitteetFields = ({ language, name }) => {
  const { options: tyyppiOptions } = useKoodistoOptions({
    koodisto: 'liitetyypitamm',
  });

  const { t } = useTranslation();

  const yhteinenToimitusaikaName = `${name}.yhteinenToimitusaika`;
  const yhteinenToimituspaikkaName = `${name}.yhteinenToimituspaikka`;

  return (
    <Fields
      names={[yhteinenToimitusaikaName, yhteinenToimituspaikkaName]}
      component={LiitteetField}
      t={t}
      language={language}
      tyyppiOptions={tyyppiOptions}
      yhteinenToimitusaikaName={yhteinenToimitusaikaName}
      yhteinenToimituspaikkaName={yhteinenToimituspaikkaName}
      baseName={name}
    />
  );
};

export default LiitteetFields;
