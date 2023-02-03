import React, { useEffect } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { AvoinKorkeakoulutusField } from '#/src/components/AvoinKorkeakoulutusField';
import {
  FormFieldEditor,
  FormFieldInput,
  FormFieldSwitch,
} from '#/src/components/formFields';
import { OpinnonTyyppiField } from '#/src/components/OpinnonTyyppiField';
import { OpintojenLaajuusFieldExtended } from '#/src/components/OpintojenLaajuusFieldExtended';
import { OpintojenLaajuusFieldRange } from '#/src/components/OpintojenLaajuusFieldRange';
import { TunnisteField } from '#/src/components/TunnisteField';
import { VerticalBox } from '#/src/components/VerticalBox';
import { Box } from '#/src/components/virkailija';
import { KOULUTUSTYYPPI, OpintojenLaajuusyksikko } from '#/src/constants';
import { useLanguageTab } from '#/src/contexts/LanguageTabContext';
import { useBoundFormActions, useFieldValue } from '#/src/hooks/form';
import useKoodi from '#/src/hooks/useKoodi';
import VaativaErityinenTukiField from '#/src/pages/toteutus/ToteutusForm/TiedotSection/VaativaErityinenTukiField';
import { ToteutusTiedotSectionProps } from '#/src/types/toteutusTypes';
import { getTestIdProps } from '#/src/utils';
import getKoodiNimiTranslation from '#/src/utils/getKoodiNimiTranslation';

import { OpintojenLaajuusReadOnlyField } from './OpintojenLaajuusReadOnlyField';
import { TaiteenalatField } from './TiedotSection/TaiteenalatField';

type NimiSectionProps = {
  name: string;
  language: LanguageCode;
  disabled?: boolean;
};

const NimiSection = ({ name, language, disabled }: NimiSectionProps) => {
  const { t } = useTranslation();

  return (
    <div {...getTestIdProps('toteutuksenNimi')}>
      <Field
        name={`${name}.nimi.${language}`}
        component={FormFieldInput}
        label={t('toteutuslomake.toteutuksenNimi')}
        disabled={disabled}
        required
      />
    </div>
  );
};

const LaajuusJaAloituspaikat = ({
  name,
  koulutus,
  language,
  laajuusyksikkoKoodiUri,
}) => {
  const selectedLanguage = useLanguageTab();
  const { t } = useTranslation();

  return (
    <Box display="flex">
      <Box maxWidth="300px">
        <OpintojenLaajuusReadOnlyField
          selectedLanguage={selectedLanguage}
          laajuusKoodiUri={koulutus?.metadata?.opintojenLaajuusKoodiUri}
          laajuusyksikkoKoodiUri={laajuusyksikkoKoodiUri}
          laajuusNumero={koulutus?.metadata?.opintojenLaajuusNumero}
        />
      </Box>
      <Box ml={2} {...getTestIdProps('aloituspaikat')}>
        <Field
          name={`${name}.aloituspaikat`}
          component={FormFieldInput}
          label={t('toteutuslomake.aloituspaikat')}
          type="number"
        />
      </Box>
      <Box ml={2} {...getTestIdProps('aloituspaikkakuvaus')}>
        <Field
          name={`${name}.aloituspaikkakuvaus.${language}`}
          component={FormFieldEditor}
          label={t('toteutuslomake.aloituspaikkojenKuvaus')}
        />
      </Box>
    </Box>
  );
};

type CommonTiedotProps = {
  name: string;
};

const CommonTiedotFields = ({ name }: CommonTiedotProps) => {
  const { t } = useTranslation();

  return (
    <VerticalBox gap={2}>
      <Field name={`${name}.isTaydennyskoulutus`} component={FormFieldSwitch}>
        {t('toteutuslomake.isTaydennyskoulutus')}
      </Field>
      <Field name={`${name}.hasJotpaRahoitus`} component={FormFieldSwitch}>
        {t('toteutuslomake.jotpaRahoitus')}
      </Field>
      <Field name={`${name}.isTyovoimakoulutus`} component={FormFieldSwitch}>
        {t('toteutuslomake.isTyovoimakoulutus')}
      </Field>
    </VerticalBox>
  );
};

const useNimiFromKoulutus = ({ koulutus, name }) => {
  const koulutusnimi = koulutus.nimi;
  const { change } = useBoundFormActions();
  const currNimi = useFieldValue(`${name}.nimi`);
  const { t } = useTranslation();

  useEffect(() => {
    if (_fp.isUndefined(currNimi) || _fp.isEmpty(currNimi)) {
      change(`${name}.nimi`, koulutusnimi || {});
    }
  }, [change, currNimi, koulutusnimi, name, t]);
};

export const TuvaTiedotSection = ({
  name,
  language,
  koulutus,
}: ToteutusTiedotSectionProps) => {
  const { t } = useTranslation();

  useNimiFromKoulutus({ koulutus, name });

  return (
    <VerticalBox gap={2}>
      <NimiSection name={name} language={language} disabled={true} />
      <LaajuusJaAloituspaikat
        name={name}
        language={language}
        koulutus={koulutus}
        laajuusyksikkoKoodiUri={OpintojenLaajuusyksikko.OSAAMISPISTE}
      />
      <Field
        name={`${name}.jarjestetaanErityisopetuksena`}
        component={FormFieldSwitch}
      >
        {t('toteutuslomake.jarjestetaanErityisopetuksena')}
      </Field>
      <CommonTiedotFields name={name} />
    </VerticalBox>
  );
};

export const TelmaTiedotSection = ({
  language,
  name,
  koulutus,
}: ToteutusTiedotSectionProps) => {
  useNimiFromKoulutus({ koulutus, name });

  return (
    <VerticalBox gap={2}>
      <NimiSection name={name} language={language} disabled={true} />
      <LaajuusJaAloituspaikat
        name={name}
        language={language}
        koulutus={koulutus}
        laajuusyksikkoKoodiUri={OpintojenLaajuusyksikko.OSAAMISPISTE}
      />
      <CommonTiedotFields name={name} />
    </VerticalBox>
  );
};

export const AikuistenperusopetusTiedotSection = ({
  name,
  language,
  koulutus,
}: ToteutusTiedotSectionProps) => {
  useNimiFromKoulutus({ koulutus, name });

  return (
    <VerticalBox gap={2}>
      <NimiSection name={name} language={language} />
      <LaajuusJaAloituspaikat
        name={name}
        language={language}
        koulutus={koulutus}
        laajuusyksikkoKoodiUri={
          koulutus?.metadata?.opintojenLaajuusyksikkoKoodiUri
        }
      />
      <CommonTiedotFields name={name} />
    </VerticalBox>
  );
};

export const TaiteenperusopetusTiedotSection = ({
  name,
  language,
  disabled,
  koulutus,
}: ToteutusTiedotSectionProps) => {
  useNimiFromKoulutus({ koulutus, name });

  return (
    <VerticalBox gap={2}>
      <NimiSection name={name} language={language} />
      <OpintojenLaajuusFieldRange name={name} disabled={disabled} />
      <TaiteenalatField name={name} disabled={disabled} />
      <CommonTiedotFields name={name} />
    </VerticalBox>
  );
};

export const VapaaSivistystyoOpistovuosiTiedotSection = ({
  koulutus,
  language,
  name,
}: ToteutusTiedotSectionProps) => {
  useNimiFromKoulutus({ koulutus, name });

  return (
    <VerticalBox gap={2}>
      <NimiSection name={name} language={language} disabled={true} />
      <OpintojenLaajuusReadOnlyField
        selectedLanguage={language}
        laajuusKoodiUri={koulutus?.metadata?.opintojenLaajuusKoodiUri}
        laajuusyksikkoKoodiUri={
          koulutus?.metadata?.opintojenLaajuusyksikkoKoodiUri
        }
        laajuusNumero={koulutus?.metadata?.opintojenLaajuusNumero}
      />
      <CommonTiedotFields name={name} />
    </VerticalBox>
  );
};

export const VapaaSivistystyoMuuTiedotSection = ({
  koulutus,
  language,
  name,
}: ToteutusTiedotSectionProps) => {
  useNimiFromKoulutus({ koulutus, name });

  return (
    <VerticalBox gap={2}>
      <NimiSection name={name} language={language} disabled={false} />
      <OpintojenLaajuusReadOnlyField
        selectedLanguage={language}
        laajuusKoodiUri={koulutus?.metadata?.opintojenLaajuusKoodiUri}
        laajuusyksikkoKoodiUri={
          koulutus?.metadata?.opintojenLaajuusyksikkoKoodiUri
        }
        laajuusNumero={koulutus?.metadata?.opintojenLaajuusNumero}
      />
      <CommonTiedotFields name={name} />
    </VerticalBox>
  );
};

export const AmmMuuTiedotSection = VapaaSivistystyoMuuTiedotSection;

export const KkOpintojaksoTiedotSection = ({
  language,
  disabled,
  name,
  koulutus,
}: ToteutusTiedotSectionProps) => (
  <VerticalBox gap={2}>
    <NimiSection name={name} language={language} disabled={disabled} />
    <OpintojenLaajuusReadOnlyField
      selectedLanguage={language}
      laajuusKoodiUri={koulutus?.metadata?.opintojenLaajuusKoodiUri}
      laajuusyksikkoKoodiUri={
        koulutus?.metadata?.opintojenLaajuusyksikkoKoodiUri
      }
      laajuusNumero={koulutus?.metadata?.opintojenLaajuusNumero}
    />
    <CommonTiedotFields name={name} />
    <TunnisteField name={name} />
    <OpinnonTyyppiField name={name} />
    <AvoinKorkeakoulutusField name={name} />
  </VerticalBox>
);

export const KkOpintokokonaisuusTiedotSection = ({
  language,
  disabled,
  name,
  koulutus,
}: ToteutusTiedotSectionProps) => {
  const laajuusyksikkoKoodiUri =
    koulutus?.metadata?.opintojenLaajuusyksikkoKoodiUri;
  const { koodi: forcedLaajuusKoodi } = useKoodi(laajuusyksikkoKoodiUri);

  const laajuusYksikkoTextValue = laajuusyksikkoKoodiUri
    ? getKoodiNimiTranslation(forcedLaajuusKoodi, language) || ''
    : '';

  return (
    <VerticalBox gap={2}>
      <NimiSection name={name} language={language} disabled={disabled} />
      <OpintojenLaajuusFieldExtended
        name={name}
        disabled={disabled}
        defaultLaajuusYksikko={laajuusYksikkoTextValue}
      />
      <TunnisteField name={name} />
      <OpinnonTyyppiField name={name} />
      <AvoinKorkeakoulutusField name={name} />
      <CommonTiedotFields name={name} />
    </VerticalBox>
  );
};

export const OpettajaTiedotSection = ({
  koulutus,
  language,
  disabled,
  name,
}: ToteutusTiedotSectionProps) => (
  <VerticalBox gap={2}>
    <NimiSection name={name} language={language} disabled={disabled} />
    <LaajuusJaAloituspaikat
      name={name}
      language={language}
      koulutus={koulutus}
      laajuusyksikkoKoodiUri={OpintojenLaajuusyksikko.OPINTOPISTE}
    />
    <CommonTiedotFields name={name} />
  </VerticalBox>
);

export const TutkinnonOsaTiedotSection = ({
  koulutus,
  language,
  name,
}: ToteutusTiedotSectionProps) => (
  <VerticalBox gap={2}>
    <NimiSection name={name} language={language} disabled={true} />
    <LaajuusJaAloituspaikat
      name={name}
      language={language}
      koulutus={koulutus}
      laajuusyksikkoKoodiUri={OpintojenLaajuusyksikko.OSAAMISPISTE}
    />
    <CommonTiedotFields name={name} />
  </VerticalBox>
);

export const OsaamisalaTiedotSection = TutkinnonOsaTiedotSection;

export const TutkintoonJohtavaTiedotSection = ({
  language,
  name,
  koulutustyyppi,
  disabled,
  koulutus,
}: ToteutusTiedotSectionProps) => {
  return (
    <VerticalBox gap={2}>
      <NimiSection name={name} language={language} disabled={disabled} />
      {koulutustyyppi === KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS && (
        <VaativaErityinenTukiField name={name} koulutus={koulutus} />
      )}
      <CommonTiedotFields name={name} />
    </VerticalBox>
  );
};

export const DIATiedotSection = ({
  koulutus,
  language,
  name,
}: ToteutusTiedotSectionProps) => {
  useNimiFromKoulutus({ koulutus, name });

  return (
    <VerticalBox gap={2}>
      <NimiSection name={name} language={language} disabled={false} />
      <CommonTiedotFields name={name} />
    </VerticalBox>
  );
};

export const EBTiedotSection = DIATiedotSection;

export const ErikoistumiskoulutusTiedotSection = DIATiedotSection;

export const LukioTiedotSection = ({ name }: ToteutusTiedotSectionProps) => {
  return (
    <VerticalBox gap={2}>
      <CommonTiedotFields name={name} />
    </VerticalBox>
  );
};
