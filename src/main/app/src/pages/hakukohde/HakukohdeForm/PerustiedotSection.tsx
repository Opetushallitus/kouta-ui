import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import {
  FormFieldAsyncKoodistoSelect,
  FormFieldCheckbox,
  FormFieldInput,
} from '#/src/components/formFields';
import { Box, Divider } from '#/src/components/virkailija';
import {
  KOULUTUSTYYPPI,
  TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT,
} from '#/src/constants';
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
}) => {
  const isAmmatillinen =
    TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT.includes(koulutustyyppi);
  const isLukio = koulutustyyppi === KOULUTUSTYYPPI.LUKIOKOULUTUS;

  const hasHakukohdeKoodiUri = checkHasHakukohdeKoodiUri(koulutustyyppi, haku);
  const { t } = useTranslation();

  return (
    <>
      {hasHakukohdeKoodiUri ? (
        <Box marginBottom={2}>
          <HakukohdeKoodiInput
            name={`${name}.hakukohdeKoodiUri`}
            toteutus={toteutus}
          />
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
