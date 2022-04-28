import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import {
  FormFieldEditor,
  FormFieldInput,
  FormFieldSwitch,
} from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';
import {
  KOULUTUSTYYPPI,
  TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT,
} from '#/src/constants';
import { getTestIdProps } from '#/src/utils';

export const TutkintoonjohtavatTiedotSection = ({
  language,
  name,
  koulutustyyppi,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {koulutustyyppi !== KOULUTUSTYYPPI.LUKIOKOULUTUS && (
        <Box mb={2} {...getTestIdProps('toteutuksenNimi')}>
          <Field
            name={`${name}.nimi.${language}`}
            component={FormFieldInput}
            disabled={false}
            label={t('toteutuslomake.toteutuksenNimi')}
            required
          />
        </Box>
      )}

      {TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT.includes(
        koulutustyyppi
      ) && (
        <Box mb={2}>
          <Field
            name={`${name}.ammatillinenPerustutkintoErityisopetuksena`}
            component={FormFieldSwitch}
          >
            {t('toteutuslomake.ammatillinenPerustutkintoErityisopetuksena')}
          </Field>
        </Box>
      )}
      {
        /* TODO: name-attribuutin alkuun sectionin name. Muuten validointivirheen tullessa tätä kenttää ei osata korostaa oikein. */
        <Box mb={2} {...getTestIdProps('toteutuksenKuvaus')}>
          <Field
            name={`kuvaus.${language}`}
            component={FormFieldEditor}
            label={t('toteutuslomake.toteutuksenYleinenKuvaus')}
          />
        </Box>
      }
    </>
  );
};
