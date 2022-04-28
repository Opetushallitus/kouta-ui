import { useEffect } from 'react';

import Box from '@opetushallitus/virkailija-ui-components/Box';
import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import {
  FormFieldEditor,
  FormFieldInput,
  FormFieldSwitch,
} from '#/src/components/formFields';
import { KOULUTUSTYYPPI } from '#/src/constants';
import { useLanguageTab } from '#/src/contexts/LanguageTabContext';
import { useBoundFormActions, useFieldValue } from '#/src/hooks/form';
import { isIn, getTestIdProps } from '#/src/utils';

import { OpintojenLaajuusReadOnlyField } from './OpintojenLaajuusReadOnlyField';

export const TutkintoonjohtamattomatTiedotSection = ({
  language,
  name,
  koulutus,
}) => {
  const { t } = useTranslation();
  const selectedLanguage = useLanguageTab();
  const currNimi = useFieldValue(`${name}.nimi`);
  const koulutusnimi = koulutus.nimi;
  const { change } = useBoundFormActions();

  const defaultNimiShouldBeUsed =
    _fp.isUndefined(currNimi) ||
    [
      KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_MUU,
      KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_OPISTOVUOSI,
      KOULUTUSTYYPPI.MUU_AMMATILLINEN_KOULUTUS,
    ].includes(koulutus.koulutustyyppi);

  const opintojenLaajuusyksikkoKoodiUri = [
    KOULUTUSTYYPPI.TUVA,
    KOULUTUSTYYPPI.TELMA,
  ].includes(koulutus.koulutustyyppi)
    ? 'opintojenlaajuusyksikko_6'
    : koulutus?.metadata?.opintojenLaajuusyksikkoKoodiUri;

  useEffect(() => {
    if (defaultNimiShouldBeUsed) {
      change(`${name}.nimi`, koulutusnimi || {});
    }
  }, [koulutusnimi, change, defaultNimiShouldBeUsed, name, t]);

  return (
    <>
      <Box mb={2} {...getTestIdProps('toteutuksenNimi')}>
        <Field
          name={`${name}.nimi.${language}`}
          component={FormFieldInput}
          label={t('toteutuslomake.toteutuksenNimi')}
          required
          disabled={
            koulutus.koulutustyyppi !== KOULUTUSTYYPPI.AIKUISTEN_PERUSOPETUS &&
            koulutus.koulutustyyppi !==
              KOULUTUSTYYPPI.AMMATILLINEN_OPETTAJA_ERITYISOPETTAJA_JA_OPOKOULUTUS
          }
        />
      </Box>
      {[
        KOULUTUSTYYPPI.TUVA,
        KOULUTUSTYYPPI.TELMA,
        KOULUTUSTYYPPI.AIKUISTEN_PERUSOPETUS,
      ].includes(koulutus.koulutustyyppi) && (
        <Box mb={2} display="flex">
          <Box maxWidth="300px">
            <OpintojenLaajuusReadOnlyField
              selectedLanguage={selectedLanguage}
              laajuusKoodiUri={koulutus?.metadata?.opintojenLaajuusKoodiUri}
              laajuusyksikkoKoodiUri={opintojenLaajuusyksikkoKoodiUri}
              laajuusNumero={koulutus?.metadata?.opintojenLaajuusNumero}
              {...getTestIdProps('laajuus')}
            />
          </Box>
          <Box mx={2} {...getTestIdProps('aloituspaikat')}>
            <Field
              name={`${name}.aloituspaikat`}
              component={FormFieldInput}
              label={t('toteutuslomake.aloituspaikat')}
              type="number"
            />
          </Box>
        </Box>
      )}
      {[
        KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_MUU,
        KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_OPISTOVUOSI,
        KOULUTUSTYYPPI.MUU_AMMATILLINEN_KOULUTUS,
      ].includes(koulutus.koulutustyyppi) && (
        <Box maxWidth="300px">
          <OpintojenLaajuusReadOnlyField
            selectedLanguage={selectedLanguage}
            laajuusKoodiUri={koulutus?.metadata?.opintojenLaajuusKoodiUri}
            laajuusyksikkoKoodiUri={opintojenLaajuusyksikkoKoodiUri}
            laajuusNumero={koulutus?.metadata?.opintojenLaajuusNumero}
          />
        </Box>
      )}
      {koulutus.koulutustyyppi === KOULUTUSTYYPPI.TUVA && (
        <Box mb={2}>
          {
            <Field
              name={`${name}.jarjestetaanErityisopetuksena`}
              component={FormFieldSwitch}
            >
              {t('toteutuslomake.jarjestetaanErityisopetuksena')}
            </Field>
          }
        </Box>
      )}
      {[
        KOULUTUSTYYPPI.OSAAMISALA,
        KOULUTUSTYYPPI.TUTKINNON_OSA,
        KOULUTUSTYYPPI.AMMATILLINEN_OPETTAJA_ERITYISOPETTAJA_JA_OPOKOULUTUS,
      ].includes(koulutus.koulutustyyppi) && (
        <>
          <Box mb={2} {...getTestIdProps('toteutuksenKuvaus')}>
            <Field
              name={`kuvaus.${language}`}
              component={FormFieldEditor}
              label={t('toteutuslomake.toteutuksenYleinenKuvaus')}
            />
          </Box>
          <Box mb={2} {...getTestIdProps('aloituspaikat')}>
            <Field
              name={`${name}.aloituspaikat`}
              component={FormFieldInput}
              label={t('toteutuslomake.aloituspaikat')}
              type="number"
            />
          </Box>
        </>
      )}
    </>
  );
};
