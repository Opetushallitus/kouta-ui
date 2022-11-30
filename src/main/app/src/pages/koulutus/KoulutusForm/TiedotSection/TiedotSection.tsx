import React, { useEffect } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldInput } from '#/src/components/formFields';
import KoulutusalaSelect from '#/src/components/KoulutusalaSelect';
import KoulutusField from '#/src/components/KoulutusField';
import { OpintojenLaajuusFieldExtended } from '#/src/components/OpintojenLaajuusFieldExtended';
import { OpintojenLaajuusFieldRange } from '#/src/components/OpintojenLaajuusFieldRange';
import { VerticalBox } from '#/src/components/VerticalBox';
import { Box, FormControl } from '#/src/components/virkailija';
import {
  KOULUTUSTYYPPI,
  TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT,
  TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
  KOULUTUS_PERUSOPETUS_KOODIURI,
  KoulutusalaKoodi,
  OPETTAJA_KOULUTUSTYYPIT,
} from '#/src/constants';
import { useBoundFormActions, useFieldValue } from '#/src/hooks/form';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';
import { getKoulutustyyppiTranslationKey, getTestIdProps } from '#/src/utils';
import { isTutkintoonJohtavaKorkeakoulutus } from '#/src/utils/koulutus/isTutkintoonJohtavaKorkeakoulutus';

import { KoulutuksenEPerusteTiedot } from '../KoulutuksenEPerusteTiedot';
import { useNimiFromKoulutusKoodi } from '../useNimiFromKoulutusKoodi';
import EnforcedKoulutusSelect from './EnforcedKoulutusSelect';
import { ErikoistumiskoulutusField } from './ErikoistumiskoulutusField';
import KoulutusalatField from './KoulutusalatField';
import { OpettajaKoulutusTiedotSubSection } from './OpettajaKoulutusTiedotSubSection';
import TutkintonimikeField from './TutkintonimikeField';

const useNimiFromKoulutustyyppi = ({ name, koulutustyyppi }) => {
  const { t } = useTranslation();
  const koulutustyyppiKey = getKoulutustyyppiTranslationKey(koulutustyyppi);
  const { change } = useBoundFormActions();
  const currNimi = useFieldValue(`${name}.nimi`);
  useEffect(() => {
    if (_fp.isUndefined(currNimi)) {
      change(`${name}.nimi`, {
        fi: t(`${koulutustyyppiKey}`, { lng: 'fi' }),
        sv: t(`${koulutustyyppiKey}`, { lng: 'sv' }),
        en: t(`${koulutustyyppiKey}`, { lng: 'en' }),
      });
    }
  }, [change, currNimi, koulutustyyppiKey, name, t]);
};

const NimiFieldFromKoulutustyyppi = ({ name, koulutustyyppi, language }) => {
  const { t } = useTranslation();

  const nimiDisabled = !useIsOphVirkailija();

  useNimiFromKoulutustyyppi({ koulutustyyppi, name });

  return (
    <div {...getTestIdProps('nimiInput')}>
      <Field
        disabled={nimiDisabled}
        name={`${name}.nimi.${language}`}
        component={FormFieldInput}
        label={t('koulutuslomake.koulutuksenNimi')}
        helperText={t('koulutuslomake.koulutuksenNimiNakyyOppijalleVaroitus')}
        required
      />
    </div>
  );
};

export const TuvaTiedotSection = ({
  disabled,
  language,
  name,
  koulutustyyppi,
}) => {
  return (
    <VerticalBox gap={2}>
      <OpintojenLaajuusFieldExtended
        disabled={disabled}
        name={name}
        required
        defaultLaajuusYksikko="viikkoa"
      />
      <NimiFieldFromKoulutustyyppi
        koulutustyyppi={koulutustyyppi}
        name={name}
        language={language}
      />
    </VerticalBox>
  );
};

export const TelmaTiedotSection = ({
  disabled,
  language,
  name,
  koulutustyyppi,
}) => {
  return (
    <VerticalBox gap={2}>
      <OpintojenLaajuusFieldExtended
        disabled={disabled}
        name={name}
        required
        defaultLaajuusYksikko="osaamispistettä"
      />
      <NimiFieldFromKoulutustyyppi
        koulutustyyppi={koulutustyyppi}
        name={name}
        language={language}
      />
    </VerticalBox>
  );
};

export const AikuistenPerusopetusTiedotSection = ({
  disabled,
  language,
  name,
  koulutustyyppi,
}) => {
  return (
    <VerticalBox gap={2}>
      <EnforcedKoulutusSelect
        value={{ value: KOULUTUS_PERUSOPETUS_KOODIURI }}
      />
      <div {...getTestIdProps('opintojenlaajuusSelect')}>
        <OpintojenLaajuusFieldExtended
          name={name}
          disabled={disabled}
          required
        />
      </div>
      <NimiFieldFromKoulutustyyppi
        koulutustyyppi={koulutustyyppi}
        name={name}
        language={language}
      />
    </VerticalBox>
  );
};

export const VapaaSivistystyoOpistovuosiTiedotSection = ({
  disabled,
  language,
  name,
}) => {
  const { t } = useTranslation();
  return (
    <VerticalBox gap={2}>
      <OpintojenLaajuusFieldExtended
        disabled={disabled}
        name={name}
        required
        defaultLaajuusYksikko="opintopistettä"
      />
      <KoulutusalatField disabled={disabled} name={name} />
      <Field
        disabled={disabled}
        name={`${name}.nimi.${language}`}
        component={FormFieldInput}
        label={t('koulutuslomake.koulutuksenNimi')}
        helperText={t('koulutuslomake.koulutuksenNimiNakyyOppijalleVaroitus')}
        required
      />
    </VerticalBox>
  );
};

export const MuuTiedotSection = ({ disabled, language, name }) => {
  const { t } = useTranslation();

  return (
    <VerticalBox gap={2}>
      <OpintojenLaajuusFieldExtended name={name} disabled={disabled} required />
      <KoulutusalatField disabled={disabled} name={name} />
      <Field
        disabled={disabled}
        name={`${name}.nimi.${language}`}
        component={FormFieldInput}
        label={t('koulutuslomake.koulutuksenNimi')}
        helperText={t('koulutuslomake.koulutuksenNimiNakyyOppijalleVaroitus')}
        required
      />
    </VerticalBox>
  );
};

export const KkOpintojaksoTiedotSection = ({ disabled, language, name }) => {
  const { t } = useTranslation();

  return (
    <VerticalBox gap={2}>
      <OpintojenLaajuusFieldExtended name={name} disabled={disabled} />
      <KoulutusalatField disabled={disabled} name={name} />
      <Field
        disabled={disabled}
        name={`${name}.nimi.${language}`}
        component={FormFieldInput}
        label={t('koulutuslomake.koulutuksenNimi')}
        helperText={t('koulutuslomake.koulutuksenNimiNakyyOppijalleVaroitus')}
        required
      />
    </VerticalBox>
  );
};

export const ReadOnlyKoulutusalaSection = ({ koodiUri }) => {
  const { t } = useTranslation();
  return (
    <FormControl
      label={t('koulutuslomake.valitseKoulutusalat')}
      disabled={true}
    >
      <KoulutusalaSelect value={{ value: koodiUri }} />
    </FormControl>
  );
};

export const ErikoislaakariTiedotSection = ({
  koulutustyyppi,
  disabled,
  language,
  name,
}) => {
  const { t } = useTranslation();

  useNimiFromKoulutusKoodi({
    nimiFieldName: `${name}.nimi`,
    koulutusFieldName: `${name}.koulutus`,
  });

  return (
    <VerticalBox gap={2}>
      <KoulutusField
        disabled={disabled}
        name={`${name}.koulutus`}
        koulutustyyppi={koulutustyyppi}
        language={language}
        valitseKoulutusLabel={t('yleiset.valitseKoulutus')}
        required
      />
      <TutkintonimikeField disabled={disabled} name={name} />
      <ReadOnlyKoulutusalaSection koodiUri={KoulutusalaKoodi.TERVEYS} />
      <Field
        disabled={disabled}
        name={`${name}.nimi.${language}`}
        component={FormFieldInput}
        label={t('koulutuslomake.koulutuksenNimi')}
        helperText={t('koulutuslomake.koulutuksenNimiNakyyOppijalleVaroitus')}
        required
      />
    </VerticalBox>
  );
};

export const TiedotSection = ({ disabled, language, koulutustyyppi, name }) => {
  const { t } = useTranslation();

  useNimiFromKoulutusKoodi({
    nimiFieldName: `${name}.nimi`,
    koulutusFieldName: isTutkintoonJohtavaKorkeakoulutus(koulutustyyppi)
      ? `${name}.korkeakoulutukset`
      : `${name}.koulutus`,
  });
  return (
    <VerticalBox gap={2}>
      {TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT.includes(
        koulutustyyppi
      ) && (
        <KoulutuksenEPerusteTiedot
          disabled={disabled}
          language={language}
          name={name}
        />
      )}
      {isTutkintoonJohtavaKorkeakoulutus(koulutustyyppi) && (
        <>
          <Box {...getTestIdProps('korkeakoulutuskoodiSelect')}>
            <KoulutusField
              disabled={disabled}
              name={`${name}.korkeakoulutukset`}
              koulutustyyppi={koulutustyyppi}
              language={language}
              isMultiSelect={true}
              valitseKoulutusLabel={t('yleiset.valitseKoulutukset')}
              required
            />
          </Box>

          <OpintojenLaajuusFieldExtended
            disabled={disabled}
            name={name}
            defaultLaajuusYksikko="opintopistettä"
          />
          <TutkintonimikeField disabled={disabled} name={name} />
          <KoulutusalatField disabled={disabled} name={name} />
        </>
      )}
      {koulutustyyppi === KOULUTUSTYYPPI.LUKIOKOULUTUS && (
        <>
          <Box {...getTestIdProps('koulutusSelect')}>
            <KoulutusField
              disabled={disabled}
              name={`${name}.koulutus`}
              koulutustyyppi={koulutustyyppi}
              language={language}
              valitseKoulutusLabel={t('yleiset.valitseKoulutus')}
              required
            />
          </Box>
          <OpintojenLaajuusFieldExtended
            disabled={disabled}
            name={name}
            defaultLaajuusYksikko="opintopistettä"
          />
          <ReadOnlyKoulutusalaSection
            koodiUri={KoulutusalaKoodi.YLEISSIVISTAVA}
          />
        </>
      )}
      {OPETTAJA_KOULUTUSTYYPIT.includes(koulutustyyppi) && (
        <OpettajaKoulutusTiedotSubSection
          disabled={disabled}
          name={name}
          language={language}
          koulutustyyppi={koulutustyyppi}
        />
      )}
      {[
        ...TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
        KOULUTUSTYYPPI.AVOIN_YO,
        KOULUTUSTYYPPI.AVOIN_AMK,
        KOULUTUSTYYPPI.TAYDENNYSKOULUTUS,
        KOULUTUSTYYPPI.ERIKOISTUMISKOULUTUS,
        KOULUTUSTYYPPI.AMMATILLINEN_OPETTAJA_ERITYISOPETTAJA_JA_OPOKOULUTUS,
        KOULUTUSTYYPPI.OPETTAJIEN_PEDAGOGISET_OPINNOT,
        KOULUTUSTYYPPI.LUKIOKOULUTUS,
      ].includes(koulutustyyppi) && (
        <Box {...getTestIdProps('nimiInput')}>
          <Field
            disabled={disabled}
            name={`${name}.nimi.${language}`}
            component={FormFieldInput}
            label={t('koulutuslomake.muokkaaKoulutuksenNimea')}
            required
          />
        </Box>
      )}
    </VerticalBox>
  );
};

export const KkOpintokokonaisuusTiedotSection = ({
  disabled,
  language,
  name,
}) => {
  const { t } = useTranslation();

  return (
    <VerticalBox gap={2}>
      <OpintojenLaajuusFieldRange name={name} disabled={disabled} />
      <KoulutusalatField disabled={disabled} name={name} />
      <Field
        disabled={disabled}
        name={`${name}.nimi.${language}`}
        component={FormFieldInput}
        label={t('koulutuslomake.koulutuksenNimi')}
        helperText={t('koulutuslomake.koulutuksenNimiNakyyOppijalleVaroitus')}
        required
      />
    </VerticalBox>
  );
};

export const ErikoistumisKoulutusTiedotSection = ({
  disabled,
  language,
  name,
}) => {
  const { t } = useTranslation();

  useNimiFromKoulutusKoodi({
    nimiFieldName: `${name}.nimi`,
    koulutusFieldName: `${name}.erikoistumiskoulutus`,
  });

  return (
    <VerticalBox gap={2}>
      <ErikoistumiskoulutusField
        name={name}
        required={true}
        disabled={disabled}
      />
      <OpintojenLaajuusFieldRange name={name} disabled={disabled} />
      <KoulutusalatField disabled={disabled} name={name} />
      <Field
        disabled={disabled}
        name={`${name}.nimi.${language}`}
        component={FormFieldInput}
        label={t('koulutuslomake.koulutuksenNimi')}
        helperText={t('koulutuslomake.koulutuksenNimiNakyyOppijalleVaroitus')}
        required
      />
    </VerticalBox>
  );
};
