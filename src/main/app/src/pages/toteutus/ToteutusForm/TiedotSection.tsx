import React, { useEffect } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { AvoinKorkeakoulutusField } from '#/src/components/AvoinKorkeakoulutusField';
import { FormFieldInput, FormFieldSwitch } from '#/src/components/formFields';
import { OpintojenLaajuusFieldExtended } from '#/src/components/OpintojenLaajuusFieldExtended';
import { VerticalBox } from '#/src/components/VerticalBox';
import { Box } from '#/src/components/virkailija';
import { KOULUTUSTYYPPI, OpintojenLaajuusyksikko } from '#/src/constants';
import { useLanguageTab } from '#/src/contexts/LanguageTabContext';
import { useBoundFormActions, useFieldValue } from '#/src/hooks/form';
import VaativaErityinenTukiField from '#/src/pages/toteutus/ToteutusForm/TiedotSection/VaativaErityinenTukiField';
import { ToteutusTiedotSectionProps } from '#/src/types/toteutusTypes';
import { getTestIdProps } from '#/src/utils';

import { OpintojenLaajuusReadOnlyField } from './OpintojenLaajuusReadOnlyField';

type NimiSectionProps = {
  name: string;
  language: LanguageCode;
  disabled?: boolean;
};

type JotpaSectionProps = {
  name: string;
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

const LaajuusJaAloituspaikat = ({ name, koulutus, laajuusyksikkoKoodiUri }) => {
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
    </Box>
  );
};

const JotpaSection = ({ name }: JotpaSectionProps) => {
  const { t } = useTranslation();

  return (
    <div {...getTestIdProps('jotpaRahoitus')}>
      <Field name={`${name}.hasJotpaRahoitus`} component={FormFieldSwitch}>
        {t('toteutuslomake.jotpaRahoitus')}
      </Field>
    </div>
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
        koulutus={koulutus}
        laajuusyksikkoKoodiUri={OpintojenLaajuusyksikko.OSAAMISPISTE}
      />
      <Field
        name={`${name}.jarjestetaanErityisopetuksena`}
        component={FormFieldSwitch}
      >
        {t('toteutuslomake.jarjestetaanErityisopetuksena')}
      </Field>
      <JotpaSection name={name} />
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
        koulutus={koulutus}
        laajuusyksikkoKoodiUri={OpintojenLaajuusyksikko.OSAAMISPISTE}
      />
      <JotpaSection name={name} />
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
        koulutus={koulutus}
        laajuusyksikkoKoodiUri={
          koulutus?.metadata?.opintojenLaajuusyksikkoKoodiUri
        }
      />
      <JotpaSection name={name} />
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
      <JotpaSection name={name} />
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
      <JotpaSection name={name} />
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
    <JotpaSection name={name} />
    <AvoinKorkeakoulutusField name={name} />
  </VerticalBox>
);

export const KkOpintokokonaisuusTiedotSection = ({
  language,
  disabled,
  name,
  koulutus,
}: ToteutusTiedotSectionProps) => (
  <VerticalBox gap={2}>
    <NimiSection name={name} language={language} disabled={disabled} />
    <OpintojenLaajuusFieldExtended name={name} disabled={disabled} />
    <AvoinKorkeakoulutusField name={name} />
  </VerticalBox>
);

export const AmmOpoJaErityisopeTiedotSection = ({
  koulutus,
  language,
  disabled,
  name,
}: ToteutusTiedotSectionProps) => (
  <VerticalBox gap={2}>
    <NimiSection name={name} language={language} disabled={disabled} />
    <LaajuusJaAloituspaikat
      name={name}
      koulutus={koulutus}
      laajuusyksikkoKoodiUri={OpintojenLaajuusyksikko.OSAAMISPISTE}
    />
    <JotpaSection name={name} />
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
      koulutus={koulutus}
      laajuusyksikkoKoodiUri={OpintojenLaajuusyksikko.OSAAMISPISTE}
    />
    <JotpaSection name={name} />
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
      <JotpaSection name={name} />
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
      <JotpaSection name={name} />
    </VerticalBox>
  );
};

export const EBTiedotSection = DIATiedotSection;

export const LukioTiedotSection = ({ name }: ToteutusTiedotSectionProps) => {
  return (
    <VerticalBox gap={2}>
      <JotpaSection name={name} />
    </VerticalBox>
  );
};
