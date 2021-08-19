import React, { useMemo } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Field, FieldArray, Fields } from 'redux-form';

import Button from '#/src/components/Button';
import FieldArrayList from '#/src/components/FieldArrayList';
import {
  FormFieldDateTimeInput,
  FormFieldInput,
  FormFieldSelect,
  FormFieldCheckbox,
  FormFieldRadioGroup,
  FormFieldPostinumeroSelect,
  FormFieldEditor,
} from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';
import { Typography } from '#/src/components/virkailija';
import { LIITTEEN_TOIMITUSTAPA } from '#/src/constants';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import useOrganisaatio from '#/src/hooks/useOrganisaatio';
import { getTestIdProps } from '#/src/utils';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import getOrganisaatioContactInfo from '#/src/utils/organisaatio/getOrganisaatioContactInfo';

const ContactInfo = ({
  osoite,
  postinumero,
  postitoimipaikka,
  sahkoposti,
  language,
}) => {
  const translatedOsoite = getFirstLanguageValue(osoite, language);
  const translatedPostitoimipaikka = getFirstLanguageValue(
    postitoimipaikka,
    language
  );

  return translatedOsoite &&
    postinumero &&
    translatedPostitoimipaikka &&
    sahkoposti
    ? [
        translatedOsoite,
        `${postinumero} ${translatedPostitoimipaikka}`,
        sahkoposti,
      ].map((value, index) => (
        <Typography variant="secondary" as="div" key={index}>
          {value}
        </Typography>
      ))
    : null;
};

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

const useOrganisaatioContactInfo = oid => {
  const { organisaatio, ...rest } = useOrganisaatio(oid);

  const contactInfo = useMemo(() => {
    return organisaatio ? getOrganisaatioContactInfo(organisaatio) : null;
  }, [organisaatio]);

  return { contactInfo, ...rest };
};

const ToimituspaikkaFields = ({ name, language }) => {
  const { t } = useTranslation();

  return (
    <>
      <Box marginBottom={2} {...getTestIdProps('osoite')}>
        <Field
          name={`${name}.osoite.${language}`}
          required
          component={FormFieldInput}
          label={t('yleiset.osoite')}
        />
      </Box>

      <Box marginBottom={2} {...getTestIdProps('postinumero')}>
        <Field
          name={`${name}.postinumero`}
          required
          component={FormFieldPostinumeroSelect}
          label={t('yleiset.postinumero')}
        />
      </Box>

      <Box {...getTestIdProps('sahkoposti')}>
        <Field
          name={`${name}.sahkoposti`}
          required
          component={FormFieldInput}
          label={t('yleiset.sahkoposti')}
        />
      </Box>
    </>
  );
};

const ToimitustapaPaikkaFields = ({
  input: { value: toimitustapa },
  baseName,
  language,
  contactInfo,
}) => {
  if (toimitustapa === LIITTEEN_TOIMITUSTAPA.MUU_OSOITE) {
    return (
      <Box marginTop={2}>
        <ToimituspaikkaFields name={baseName} language={language} />
      </Box>
    );
  } else if (
    toimitustapa === LIITTEEN_TOIMITUSTAPA.JARJESTAJAN_OSOITE &&
    contactInfo
  ) {
    return (
      <Box marginTop={2}>
        <ContactInfo {...contactInfo} language={language} />
      </Box>
    );
  }

  return null;
};

const ToimitustapaFields = ({ name, t, language, contactInfo }) => {
  const options = useMemo(() => {
    return [
      {
        value: LIITTEEN_TOIMITUSTAPA.TOIMITETAAN_LAHETTAMISEN_YHTEYDESSA,
        label: t(
          'liitteenToimitustapaValinnat.toimitetaanLahettamisenYhteydessa'
        ),
      },
      // NOTE: Määrittely päivittyi ettei järjestäjän osoitetta haluta näyttää valittavana, mutta palautetaan jos joskus tulee tarve
      // {
      //   value: LIITTEEN_TOIMITUSTAPA.JARJESTAJAN_OSOITE,
      //   label: t('liitteenToimitustapaValinnat.jarjestajanOsoite'),
      // },
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
        contactInfo={contactInfo}
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
  contactInfo,
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
                contactInfo={contactInfo}
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
  contactInfo,
  ...props
}) => {
  const yhteinenToimitusaika = Boolean(
    _.get(props, [baseName, 'yhteinenToimitusaika', 'input', 'value'])
  );

  const yhteinenToimituspaikka = Boolean(
    _.get(props, [baseName, 'yhteinenToimituspaikka', 'input', 'value'])
  );

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
          contactInfo={contactInfo}
          t={t}
        />
      </Box>
      <Box>
        <Field name={yhteinenToimitusaikaName} component={FormFieldCheckbox}>
          {t('hakukohdelomake.kaytaLiitteilleYhteistaToimitusaikaa')}
        </Field>
        {yhteinenToimitusaika ? (
          <Box marginTop={2} marginBottom={2}>
            <ToimitusaikaFields name={`${baseName}.toimitusaika`} />
          </Box>
        ) : null}
      </Box>
      <Box>
        <Field name={yhteinenToimituspaikkaName} component={FormFieldCheckbox}>
          {t('hakukohdelomake.kaytaLiitteilleYhteistaToimituspaikkaa')}
        </Field>
        {yhteinenToimituspaikka ? (
          <Box marginTop={2}>
            <ToimitustapaFields
              language={language}
              name={`${baseName}.toimitustapa`}
              t={t}
              contactInfo={contactInfo}
            />
          </Box>
        ) : null}
      </Box>
    </>
  );
};

export const LiitteetFields = ({ language, name, organisaatioOid }) => {
  const { options: tyyppiOptions } = useKoodistoOptions({
    koodisto: 'liitetyypitamm',
  });

  const { t } = useTranslation();
  const { contactInfo } = useOrganisaatioContactInfo(organisaatioOid);

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
      contactInfo={contactInfo}
    />
  );
};
