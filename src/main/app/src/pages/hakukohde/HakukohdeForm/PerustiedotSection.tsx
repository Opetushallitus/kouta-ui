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
  TOINEN_ASTE_YHTEISHAKU_KOULUTUSTYYPIT,
  TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT,
} from '#/src/constants';
import useKoodisto from '#/src/hooks/useKoodisto';
import { getTestIdProps } from '#/src/utils';
import isYhteishakuHakutapa from '#/src/utils/isYhteishakuHakutapa';

import { AlkamiskausiSection } from './AlkamiskausiSection';
import { HakuajatSection } from './HakuajatSection';
import LomakeSection from './LomakeSection';

const HakukohdeKoodiInput = ({ name }) => {
  const { t } = useTranslation();

  // TODO: Eri koodisto erityisopetuksella
  const { data: koodistoData } = useKoodisto({ koodisto: 'hakukohteet' });

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

const checkIsToisenAsteenYhteishaku = (koulutustyyppi, haku) => {
  return (
    TOINEN_ASTE_YHTEISHAKU_KOULUTUSTYYPIT.includes(koulutustyyppi) &&
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

  const isToisenAsteenYhteishaku = checkIsToisenAsteenYhteishaku(
    koulutustyyppi,
    haku
  );
  const { t } = useTranslation();

  return (
    <>
      {isToisenAsteenYhteishaku ? (
        <Box marginBottom={2}>
          <HakukohdeKoodiInput name={`${name}.hakukohdeKoodiUri`} />
        </Box>
      ) : (
        <Box marginBottom={2} {...getTestIdProps('hakukohteenNimi')}>
          <Field
            name={`${name}.nimi.${language}`}
            component={FormFieldInput}
            label={t('yleiset.nimi')}
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
