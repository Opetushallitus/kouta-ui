import React from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import {
  FormFieldAsyncKoodistoSelect,
  FormFieldCheckbox,
  FormFieldInput,
} from '#/src/components/formFields';
import { Box, Divider, FormControl, Input } from '#/src/components/virkailija';
import {
  KOULUTUSTYYPPI,
  TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT,
} from '#/src/constants';
import { useLanguageTab } from '#/src/contexts/LanguageTabContext';
import useKoodisto from '#/src/hooks/useKoodisto';
import { getTestIdProps } from '#/src/utils';
import isYhteishakuHakutapa from '#/src/utils/isYhteishakuHakutapa';

import { AlkamiskausiSection } from './AlkamiskausiSection';
import { HakuajatSection } from './HakuajatSection';
import LomakeSection from './LomakeSection';

const checkJarjestetaanErityisopetuksena = toteutus =>
  toteutus?.metadata?.ammatillinenPerustutkintoErityisopetuksena ||
  toteutus?.metadata?.jarjestetaanErityisopetuksena;

const HakukohdeKoodiInput = ({ name, toteutus }) => {
  const { t } = useTranslation();

  const isErityisopetus = checkJarjestetaanErityisopetuksena(toteutus);

  const { data: koodistoData } = useKoodisto({
    koodisto: isErityisopetus
      ? 'hakukohteeterammatillinenerityisopetus'
      : 'hakukohteetperusopetuksenjalkeinenyhteishaku',
  });

  return (
    <Field
      name={name}
      component={FormFieldAsyncKoodistoSelect}
      koodistoData={koodistoData}
      label={t('yleiset.nimi')}
      required
    />
  );
};

const KOULUTUSTYYPIT_WITH_HAKUKOHDE_KOODIURI = [
  KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
];

export const checkHasHakukohdeKoodiUri = (koulutustyyppi, haku) => {
  return (
    KOULUTUSTYYPIT_WITH_HAKUKOHDE_KOODIURI.includes(koulutustyyppi) &&
    isYhteishakuHakutapa(haku?.hakutapaKoodiUri)
  );
};

export const PerustiedotSection = ({
  language,
  koulutustyyppi,
  name,
  toteutus,
  haku,
  hakukohde = undefined,
}) => {
  const isAmmatillinen =
    TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT.includes(koulutustyyppi);
  const isLukio = koulutustyyppi === KOULUTUSTYYPPI.LUKIOKOULUTUS;
  const isTuva = koulutustyyppi === KOULUTUSTYYPPI.TUVA;

  const hasHakukohdeKoodiUri = checkHasHakukohdeKoodiUri(koulutustyyppi, haku);
  const { t } = useTranslation();
  const selectedLanguage = useLanguageTab();

  const esitysnimi = hakukohde
    ? _.get(hakukohde?.esitysnimi, selectedLanguage)
    : _.get(toteutus?.nimi, selectedLanguage);

  return (
    <>
      {hasHakukohdeKoodiUri ? (
        <Box marginBottom={2}>
          <HakukohdeKoodiInput
            name={`${name}.hakukohdeKoodiUri`}
            toteutus={toteutus}
          />
        </Box>
      ) : isTuva ? (
        <Box maxWidth="600px">
          <FormControl label={t('yleiset.nimi')} disabled={true}>
            <Input value={esitysnimi} />
          </FormControl>
        </Box>
      ) : (
        <Box marginBottom={2} {...getTestIdProps('hakukohteenNimi')}>
          <Field
            name={`${name}.nimi.${language}`}
            component={FormFieldInput}
            label={t('yleiset.nimi')}
            disabled={isLukio}
            required
          />
        </Box>
      )}
      {(isAmmatillinen || isLukio) && (
        <div {...getTestIdProps('voiSuorittaaKaksoistutkinnon')}>
          <Field
            name={`${name}.voiSuorittaaKaksoistutkinnon`}
            component={FormFieldCheckbox}
          >
            {t('hakukohdelomake.voiSuorittaaKaksoistutkinnon')}
          </Field>
        </div>
      )}

      <Divider marginY={4} />

      <div {...getTestIdProps('hakuajatSection')}>
        <HakuajatSection
          name="hakuajat"
          haku={haku}
          koulutustyyppi={koulutustyyppi}
        />
      </div>

      <Divider marginY={4} />

      <div {...getTestIdProps('alkamiskausiSection')}>
        <AlkamiskausiSection
          name="ajankohta"
          language={language}
          toteutus={toteutus}
          haku={haku}
        />
      </div>

      <Divider marginY={4} />

      <div {...getTestIdProps('lomakeSection')}>
        <LomakeSection haku={haku} language={language} />
      </div>
    </>
  );
};
