import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldEditor, FormFieldInput } from '#/src/components/formFields';
import { Box, FormLabel } from '#/src/components/virkailija';
import { getTestIdProps } from '#/src/utils';
import isKorkeakouluKoulutustyyppi from '#/src/utils/koulutus/isKorkeakouluKoulutustyyppi';

export const AloituspaikatSection = ({ language, koulutustyyppi, name }) => {
  const isKorkeakoulu = isKorkeakouluKoulutustyyppi(koulutustyyppi);
  const { t } = useTranslation();

  const aloituspaikkamaaraName = `${name}.aloituspaikkamaara`;

  const aloituspaikatField = (
    <Field
      id={aloituspaikkamaaraName}
      label={t('hakukohdelomake.aloituspaikkojenLukumaara')}
      name={aloituspaikkamaaraName}
      component={FormFieldInput}
      type="number"
      required
      {...getTestIdProps('aloituspaikkamaara')}
    />
  );

  const ensikertalaismaaraName = `${name}.ensikertalaismaara`;

  const ensikertalaisetField = (
    <>
      <FormLabel htmlFor={ensikertalaismaaraName}>
        {t('hakukohdelomake.ensikertalaistenAloituspaikkojenLukumaara')}
      </FormLabel>

      <Field
        id={ensikertalaismaaraName}
        name={ensikertalaismaaraName}
        component={FormFieldInput}
        type="number"
        {...getTestIdProps('ensikertalaismaara')}
      />
    </>
  );

  return (
    <>
      {isKorkeakoulu ? (
        <>
          <Box display="flex">
            <Box flexGrow={1} paddingRight={1}>
              {aloituspaikatField}
            </Box>
            <Box flexGrow={1} paddingLeft={1}>
              {ensikertalaisetField}
            </Box>
          </Box>
          <Box marginTop={2}>
            <Field
              name={`${name}.aloituspaikkakuvaus.${language}`}
              component={FormFieldEditor}
              label={t('hakukohdelomake.aloituspaikkojenKuvaus')}
            />
          </Box>
        </>
      ) : (
        aloituspaikatField
      )}
    </>
  );
};
