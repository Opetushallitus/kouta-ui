import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldInput, FormFieldEditor } from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';
import { KOULUTUSTYYPPI } from '#/src/constants';
import { getTestIdProps } from '#/src/utils';

export const KuvausFieldsSection = ({
  disabled,
  language,
  name,
  koulutustyyppi,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {/* TODO: Onko kuvauksen nimi ylipäänsä tarpeellinen? */}
      {koulutustyyppi !== KOULUTUSTYYPPI.LUKIOKOULUTUS &&
        koulutustyyppi !== KOULUTUSTYYPPI.TUVA && (
          <Box mb={2} {...getTestIdProps('kuvauksenNimiInput')}>
            <Field
              disabled={disabled}
              name={`${name}.nimi.${language}`}
              component={FormFieldInput}
              label={t('yleiset.kuvauksenNimi')}
              required
            />
          </Box>
        )}
      <Box {...getTestIdProps('kuvausInput')}>
        <Field
          disabled={disabled}
          name={`${name}.kuvaus.${language}`}
          component={FormFieldEditor}
          label={t('yleiset.kuvaus')}
          required={koulutustyyppi === KOULUTUSTYYPPI.TUVA ? true : false}
        />
      </Box>
      {koulutustyyppi === KOULUTUSTYYPPI.TUVA && (
        <Box mb={2} {...getTestIdProps('linkkiEPerusteisiinInput')}>
          <Field
            disabled={disabled}
            name={`${name}.linkkiEPerusteisiin.${language}`}
            component={FormFieldInput}
            label={t('koulutuslomake.linkkiEPerusteisiin')}
          />
        </Box>
      )}
    </>
  );
};
