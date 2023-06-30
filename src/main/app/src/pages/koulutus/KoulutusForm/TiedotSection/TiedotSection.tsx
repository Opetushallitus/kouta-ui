import React, { useEffect } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { AvoinKorkeakoulutusField } from '#/src/components/AvoinKorkeakoulutusField';
import { FormFieldInput } from '#/src/components/formFields';
import KoulutusalaSelect from '#/src/components/KoulutusalaSelect';
import KoulutusField from '#/src/components/KoulutusField';
import { OpinnonTyyppiField } from '#/src/components/OpinnonTyyppiField';
import { OpintojenLaajuusFieldExtended } from '#/src/components/OpintojenLaajuusFieldExtended';
import { OpintojenLaajuusFieldRange } from '#/src/components/OpintojenLaajuusFieldRange';
import { TunnisteField } from '#/src/components/TunnisteField';
import { VerticalBox } from '#/src/components/VerticalBox';
import { Box, FormControl } from '#/src/components/virkailija';
import {
  KOULUTUS_PERUSOPETUS_KOODIURI,
  KoulutusalaKoodi,
  KOULUTUSTYYPPI,
  OPETTAJA_KOULUTUSTYYPIT,
  OpintojenLaajuusyksikko,
  TAITEEN_PERUSOPETUS_KOULUTUS_KOODIURI,
  TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
} from '#/src/constants';
import { useBoundFormActions, useFieldValue } from '#/src/hooks/form';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';
import useKoodi from '#/src/hooks/useKoodi';
import { getKoulutustyyppiTranslationKey, getTestIdProps } from '#/src/utils';
import { isTutkintoonJohtavaKorkeakoulutus } from '#/src/utils/koulutus/isTutkintoonJohtavaKorkeakoulutus';

import { AmmatillinenTiedotSection } from '../AmmatillinenTiedotSection/AmmatillinenTiedotSection';
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
    if (_.isUndefined(currNimi)) {
      change(`${name}.nimi`, {
        fi: t(`${koulutustyyppiKey}`, { lng: 'fi' }),
        sv: t(`${koulutustyyppiKey}`, { lng: 'sv' }),
        en: t(`${koulutustyyppiKey}`, { lng: 'en' }),
      });
    }
  }, [change, currNimi, koulutustyyppiKey, name, t]);
};

const useNimiFromFixedKoulutusKoodi = ({ nimiFieldName, koodiUri }) => {
  const byLng = ({ koodiObject, lng }) => {
    const metadata = koodiObject.metadata;
    const eqLow = (kieli, lng) => _.toLower(kieli) === lng;
    const retVal = _.find(metadata, ({ kieli }) => eqLow(kieli, lng))?.nimi;
    return retVal || _.find(metadata, ({ kieli }) => eqLow(kieli, 'fi'))?.nimi;
  };

  const { change } = useBoundFormActions();
  const currNimi = useFieldValue(nimiFieldName);
  const koulutusKoodi = useKoodi(koodiUri)?.koodi;

  useEffect(() => {
    if (_.isUndefined(currNimi) && koulutusKoodi) {
      change(nimiFieldName, {
        fi: byLng({ koodiObject: koulutusKoodi, lng: 'fi' }),
        sv: byLng({ koodiObject: koulutusKoodi, lng: 'sv' }),
        en: byLng({ koodiObject: koulutusKoodi, lng: 'en' }),
      });
    }
  }, [change, currNimi, nimiFieldName, koulutusKoodi]);
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
        fixedLaajuusYksikko={OpintojenLaajuusyksikko.VIIKKO}
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
        fixedLaajuusYksikko={OpintojenLaajuusyksikko.OSAAMISPISTE}
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

export const TaiteenPerusopetusTiedotSection = ({
  disabled,
  language,
  name,
}) => {
  const { t } = useTranslation();

  useNimiFromFixedKoulutusKoodi({
    nimiFieldName: `${name}.nimi`,
    koodiUri: TAITEEN_PERUSOPETUS_KOULUTUS_KOODIURI,
  });

  return (
    <VerticalBox gap={2}>
      <EnforcedKoulutusSelect
        value={{ value: TAITEEN_PERUSOPETUS_KOULUTUS_KOODIURI }}
      />
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
        fixedLaajuusYksikko={OpintojenLaajuusyksikko.OPINTOPISTE}
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

export const AmmMuuTiedotSection = ({ disabled, language, name }) => {
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

export const VapaaSivistystyoMuuTiedotSection = AmmMuuTiedotSection;

export const MuuTiedotSection = ({ disabled, language, name }) => {
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

export const KkOpintojaksoTiedotSection = ({ disabled, language, name }) => {
  const { t } = useTranslation();

  return (
    <VerticalBox gap={2}>
      <OpintojenLaajuusFieldRange
        name={name}
        disabled={disabled}
        forcedLaajuusYksikko={OpintojenLaajuusyksikko.OPINTOPISTE}
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
      <TunnisteField name={name} />
      <OpinnonTyyppiField name={name} />
      <AvoinKorkeakoulutusField name={name} />
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
      {koulutustyyppi === KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS && (
        <AmmatillinenTiedotSection
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
            fixedLaajuusYksikko={OpintojenLaajuusyksikko.OPINTOPISTE}
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
            fixedLaajuusYksikko={OpintojenLaajuusyksikko.OPINTOPISTE}
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
      <OpintojenLaajuusFieldRange
        name={name}
        disabled={disabled}
        forcedLaajuusYksikko={OpintojenLaajuusyksikko.OPINTOPISTE}
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
      <TunnisteField name={name} />
      <OpinnonTyyppiField name={name} />
      <AvoinKorkeakoulutusField name={name} />
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
      <OpintojenLaajuusFieldRange
        name={name}
        disabled={disabled}
        forcedLaajuusYksikko={OpintojenLaajuusyksikko.OPINTOPISTE}
      />
      <KoulutusalatField disabled={disabled} name={name} />
      <Field
        disabled={disabled}
        name={`${name}.nimi.${language}`}
        component={FormFieldInput}
        label={t('koulutuslomake.muokkaaKoulutuksenNimea')}
        helperText={t('koulutuslomake.koulutuksenNimiNakyyOppijalleVaroitus')}
        required
      />
    </VerticalBox>
  );
};
