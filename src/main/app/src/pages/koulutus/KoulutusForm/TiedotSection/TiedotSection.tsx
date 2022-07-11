import React, { useEffect } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldInput } from '#/src/components/formFields';
import KoulutusalaSelect from '#/src/components/KoulutusalaSelect';
import KoulutusField from '#/src/components/KoulutusField';
import OpintojenLaajuusFieldExtended from '#/src/components/OpintojenLaajuusFieldExtended';
import { VerticalBox } from '#/src/components/VerticalBox';
import { Box, FormControl } from '#/src/components/virkailija';
import {
  KOULUTUSTYYPPI,
  TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT,
  TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
  KoulutusalaKoodi,
} from '#/src/constants';
import { KOULUTUS_PERUSOPETUS_KOODIURI } from '#/src/constants';
import { useBoundFormActions, useFieldValue } from '#/src/hooks/form';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';
import { getKoulutustyyppiTranslationKey, getTestIdProps } from '#/src/utils';
import { isTutkintoonJohtavaKorkeakoulutus } from '#/src/utils/koulutus/isTutkintoonJohtavaKorkeakoulutus';

import { KoulutuksenEPerusteTiedot } from '../KoulutuksenEPerusteTiedot';
import { useNimiFromKoulutusKoodi } from '../useNimiFromKoulutusKoodi';
import { AmmOpettajaKoulutusTiedotSubSection } from './AmmOpettajaKoulutusTiedotSubSection';
import EnforcedKoulutusSelect from './EnforcedKoulutusSelect';
import KoulutusalatField from './KoulutusalatField';
import OpintojenlaajuusField from './OpintojenlaajuusField';
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
      <OpintojenlaajuusField disabled={disabled} name={name} required />
      <NimiFieldFromKoulutustyyppi
        koulutustyyppi={koulutustyyppi}
        name={name}
        language={language}
      />
    </VerticalBox>
  );
};

export const TelmaTiedotSection = TuvaTiedotSection;

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
      <OpintojenlaajuusField disabled={disabled} name={name} required />
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

export const KorkeakoulutusOpintojaksoTiedotSection = ({
  disabled,
  language,
  name,
}) => {
  const { t } = useTranslation();

  return (
    <Box>
      <Box mb={2}>
        <OpintojenLaajuusFieldExtended name={name} disabled={disabled} />
      </Box>
      <Box mb={2}>
        <KoulutusalatField disabled={disabled} name={name} />
      </Box>
      <Box>
        <Field
          disabled={disabled}
          name={`${name}.nimi.${language}`}
          component={FormFieldInput}
          label={t('koulutuslomake.koulutuksenNimi')}
          helperText={t('koulutuslomake.koulutuksenNimiNakyyOppijalleVaroitus')}
          required
        />
      </Box>
    </Box>
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
    <Box mb={-2}>
      {TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT.includes(
        koulutustyyppi
      ) && (
        <Box mb={2}>
          <KoulutuksenEPerusteTiedot
            disabled={disabled}
            language={language}
            name={name}
          />
        </Box>
      )}
      {isTutkintoonJohtavaKorkeakoulutus(koulutustyyppi) && (
        <>
          <Box mb={2} {...getTestIdProps('korkeakoulutuskoodiSelect')}>
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

          <Box mb={2}>
            <OpintojenlaajuusField disabled={disabled} name={name} />
          </Box>

          <Box mb={2}>
            <TutkintonimikeField disabled={disabled} name={name} />
          </Box>

          <Box mb={2}>
            <KoulutusalatField disabled={disabled} name={name} />
          </Box>
        </>
      )}
      {koulutustyyppi === KOULUTUSTYYPPI.LUKIOKOULUTUS && (
        <>
          <Box mb={2} {...getTestIdProps('koulutusSelect')}>
            <KoulutusField
              disabled={disabled}
              name={`${name}.koulutus`}
              koulutustyyppi={koulutustyyppi}
              language={language}
              valitseKoulutusLabel={t('yleiset.valitseKoulutus')}
              required
            />
          </Box>
          <Box mb={2}>
            <OpintojenlaajuusField disabled={disabled} name={name} />
          </Box>
          <Box mb={2}>
            <ReadOnlyKoulutusalaSection
              koodiUri={KoulutusalaKoodi.YLEISSIVISTAVA}
            />
          </Box>
        </>
      )}
      {koulutustyyppi ===
        KOULUTUSTYYPPI.AMMATILLINEN_OPETTAJA_ERITYISOPETTAJA_JA_OPOKOULUTUS && (
        <AmmOpettajaKoulutusTiedotSubSection
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
        KOULUTUSTYYPPI.LUKIOKOULUTUS,
      ].includes(koulutustyyppi) && (
        <Box mb={2} {...getTestIdProps('nimiInput')}>
          <Field
            disabled={disabled}
            name={`${name}.nimi.${language}`}
            component={FormFieldInput}
            label={t('koulutuslomake.muokkaaKoulutuksenNimea')}
            required
          />
        </Box>
      )}
    </Box>
  );
};
