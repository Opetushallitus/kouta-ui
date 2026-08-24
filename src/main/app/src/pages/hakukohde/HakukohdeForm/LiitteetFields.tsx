import { useMemo } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Field, FieldArray, Fields } from 'redux-form';

import FieldArrayList from '#/src/components/FieldArrayList';
import { FieldGroup } from '#/src/components/FieldGroup';
import { FormButton } from '#/src/components/FormButton';
import {
  FormFieldDateTimeInput,
  FormFieldInput,
  FormFieldSelect,
  FormFieldCheckbox,
  FormFieldRadioGroup,
  FormFieldPostinumeroSelect,
  FormFieldEditor,
  FormFieldUrlInput,
} from '#/src/components/formFields';
import { Box, FormLabel } from '#/src/components/virkailija';
import { LIITTEEN_TOIMITUSTAPA } from '#/src/constants';
import { useFieldValue } from '#/src/hooks/form';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import { getTestIdProps } from '#/src/utils';

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
      <FieldGroup
        title={t('yleiset.osoite')}
        HeadingComponent={FormLabel}
        required
        marginBottom={2}
      >
        <Box marginBottom={2}>
          <Field
            name={`${name}.osoite.rivi1.${language}`}
            component={FormFieldInput}
          />
        </Box>
        <Box>
          <Field
            name={`${name}.osoite.rivi2.${language}`}
            component={FormFieldInput}
          />
        </Box>
      </FieldGroup>

      <Box marginBottom={2} {...getTestIdProps('postinumero')}>
        <Field
          name={`${name}.postinumero.${language}`}
          required
          component={FormFieldPostinumeroSelect}
          label={t('yleiset.postinumero')}
        />
      </Box>

      <Box marginBottom={2} {...getTestIdProps('sahkoposti')}>
        <Field
          name={`${name}.sahkoposti`}
          component={FormFieldInput}
          label={t('yleiset.sahkoposti')}
        />
      </Box>
      <Box>
        <Field
          name={`${name}.verkkosivu`}
          component={FormFieldUrlInput}
          label={t('hakukohdelomake.liitteenToimitusosoiteVerkkosivu')}
        />
      </Box>
    </>
  );
};

const ToimitustapaPaikkaFields = ({
  input: { value: toimitustapa },
  baseName,
  language,
}) => {
  if (toimitustapa === LIITTEEN_TOIMITUSTAPA.MUU_OSOITE) {
    return (
      <Box marginTop={2}>
        <ToimituspaikkaFields name={baseName} language={language} />
      </Box>
    );
  }

  return null;
};

const ToimitustapaFields = ({ name, t, language }) => {
  const options = useMemo(() => {
    return [
      {
        value: LIITTEEN_TOIMITUSTAPA.TOIMITETAAN_LAHETTAMISEN_YHTEYDESSA,
        label: t(
          'liitteenToimitustapaValinnat.toimitetaanLahettamisenYhteydessa'
        ),
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
          label={t('liitteenToimitustapaValinnat.valitseToimitustapa')}
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
            <Box marginBottom={2} {...getTestIdProps('tyyppi')}>
              <Field
                name={`${liite}.tyyppi`}
                required
                component={FormFieldSelect}
                options={tyyppiOptions}
                label={t('yleiset.tyyppi')}
              />
            </Box>

            <Box marginBottom={2} {...getTestIdProps('nimi')}>
              <Field
                name={`${liite}.nimi.${language}`}
                required
                component={FormFieldInput}
                label={t('yleiset.nimi')}
              />
            </Box>

            <Box
              marginBottom={
                includeToimitusaika || includeToimituspaikka ? 2 : 0
              }
              {...getTestIdProps('kuvaus')}
            >
              <Field
                name={`${liite}.kuvaus.${language}`}
                component={FormFieldEditor}
                label={t('yleiset.kuvaus')}
                hideHeaderSelect
              />
            </Box>

            {includeToimitusaika ? (
              <Box
                marginBottom={includeToimituspaikka ? 2 : 0}
                {...getTestIdProps('toimitusaika')}
              >
                <ToimitusaikaFields name={`${liite}.toimitusaika`} />
              </Box>
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
      <Box
        display="flex"
        justifyContent="center"
        marginTop={fields.length > 0 ? 4 : 0}
      >
        <FormButton
          type="button"
          variant="outlined"
          onClick={() => {
            fields.push({});
          }}
          {...getTestIdProps('lisaaButton')}
        >
          {t('hakukohdelomake.lisaaLiite')}
        </FormButton>
      </Box>
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
    _.get(props, [baseName, 'yhteinenToimitusaika', 'input', 'value'])
  );

  const yhteinenToimituspaikka = Boolean(
    _.get(props, [baseName, 'yhteinenToimituspaikka', 'input', 'value'])
  );

  const liitteetFieldValue = useFieldValue(`${baseName}.liitteet`);

  return (
    <>
      <Box marginBottom={2} {...getTestIdProps('liitelista')}>
        <FieldArray
          name={`${baseName}.liitteet`}
          component={LiitteetListField}
          language={language}
          includeToimitusaika={!yhteinenToimitusaika}
          includeToimituspaikka={!yhteinenToimituspaikka}
          tyyppiOptions={tyyppiOptions}
          t={t}
        />
      </Box>
      {!_.isEmpty(liitteetFieldValue) && (
        <>
          <Box>
            <Field
              name={yhteinenToimitusaikaName}
              component={FormFieldCheckbox}
            >
              {t('hakukohdelomake.kaytaLiitteilleYhteistaToimitusaikaa')}
            </Field>
            {yhteinenToimitusaika ? (
              <Box marginTop={2} marginBottom={2}>
                <ToimitusaikaFields name={`${baseName}.toimitusaika`} />
              </Box>
            ) : null}
          </Box>
          <Box>
            <Field
              name={yhteinenToimituspaikkaName}
              component={FormFieldCheckbox}
            >
              {t('hakukohdelomake.kaytaLiitteilleYhteistaToimituspaikkaa')}
            </Field>
            {yhteinenToimituspaikka ? (
              <Box marginTop={2}>
                <ToimitustapaFields
                  language={language}
                  name={`${baseName}.toimitustapa`}
                  t={t}
                />
              </Box>
            ) : null}
          </Box>
        </>
      )}
    </>
  );
};

export const LiitteetSection = ({ language, name }) => {
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
