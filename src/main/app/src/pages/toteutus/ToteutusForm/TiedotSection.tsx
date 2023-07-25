import React, { useEffect } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { AvoinKorkeakoulutusField } from '#/src/components/AvoinKorkeakoulutusField';
import { FixedValueKoodiInput } from '#/src/components/FixedValueKoodiInput';
import { FormFieldInput, FormFieldSwitch } from '#/src/components/formFields';
import { OpinnonTyyppiField } from '#/src/components/OpinnonTyyppiField';
import { OpintojenLaajuusFieldExtended } from '#/src/components/OpintojenLaajuusFieldExtended';
import { OpintojenLaajuusFieldRange } from '#/src/components/OpintojenLaajuusFieldRange';
import { TunnisteField } from '#/src/components/TunnisteField';
import { VerticalBox } from '#/src/components/VerticalBox';
import { KOULUTUSTYYPPI, OpintojenLaajuusyksikko } from '#/src/constants';
import { useBoundFormActions, useFieldValue } from '#/src/hooks/form';
import { VaativaErityinenTukiField } from '#/src/pages/toteutus/ToteutusForm/TiedotSection/VaativaErityinenTukiField';
import { ToteutusTiedotSectionProps } from '#/src/types/toteutusTypes';
import { getTestIdProps } from '#/src/utils';
import getKoodiNimiTranslation from '#/src/utils/getKoodiNimiTranslation';

import { TaiteenalatField } from './TiedotSection/TaiteenalatField';
import { Box } from '#/src/components/virkailija';
import { useLanguageTab } from '#/src/contexts/LanguageTabContext';

type NimiSectionProps = {
  name: string;
  language: LanguageCode;
  disabled?: boolean;
};

const NimiSection = ({ name, language, disabled }: NimiSectionProps) => {
  const { t } = useTranslation();

  return (
    <Field
      name={`${name}.nimi.${language}`}
      component={FormFieldInput}
      label={t('toteutuslomake.toteutuksenNimi')}
      disabled={disabled}
      required
    />
  );
};

const OpintojenLaajuus = ({ name, koulutus, laajuusyksikkoKoodiUri }) => {
  const selectedLanguage = useLanguageTab();
  const { t } = useTranslation();

  return (
    <Box display="flex">
      <Box maxWidth="300px">
        <FixedValueKoodiInput
          selectedLanguage={selectedLanguage}
          koodiUri={laajuusyksikkoKoodiUri}
          label={t('toteutuslomake.laajuus')}
          prefix={koulutus?.metadata?.opintojenLaajuusNumero}
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
      <OpintojenLaajuus
        name={name}
        koulutus={koulutus}
        laajuusyksikkoKoodiUri={OpintojenLaajuusyksikko.VIIKKO}
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
      <OpintojenLaajuusReadOnlyField
        selectedLanguage={language}
        laajuusKoodiUri={koulutus?.metadata?.opintojenLaajuusKoodiUri}
        laajuusyksikkoKoodiUri={OpintojenLaajuusyksikko.OSAAMISPISTE}
        laajuusNumero={koulutus?.metadata?.opintojenLaajuusNumero}
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
  const { t } = useTranslation();

  return (
    <VerticalBox gap={2}>
      <NimiSection name={name} language={language} disabled={true} />
      <FixedValueKoodiInput
        selectedLanguage={language}
        koodiUri={koulutus?.metadata?.opintojenLaajuusyksikkoKoodiUri}
        label={t('toteutuslomake.laajuus')}
        prefix={koulutus?.metadata?.opintojenLaajuusNumero}
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
  const { t } = useTranslation();

  return (
    <VerticalBox gap={2}>
      <NimiSection name={name} language={language} disabled={false} />
      <FixedValueKoodiInput
        selectedLanguage={language}
        koodiUri={koulutus?.metadata?.opintojenLaajuusyksikkoKoodiUri}
        label={t('toteutuslomake.laajuus')}
        prefix={koulutus?.metadata?.opintojenLaajuusNumero}
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
    <OpintojenLaajuusFieldExtended
      name={name}
      disabled={disabled}
      fixedLaajuusYksikko={koulutus?.metadata?.opintojenLaajuusyksikkoKoodiUri}
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
}: ToteutusTiedotSectionProps) => (
  <VerticalBox gap={2}>
    <NimiSection name={name} language={language} disabled={disabled} />
    <OpintojenLaajuusFieldExtended
      name={name}
      disabled={disabled}
      fixedLaajuusYksikko={koulutus?.metadata?.opintojenLaajuusyksikkoKoodiUri}
    />
    <TunnisteField name={name} />
    <OpinnonTyyppiField name={name} />
    <AvoinKorkeakoulutusField name={name} />
    <CommonTiedotFields name={name} />
  </VerticalBox>
);

export const OpettajaTiedotSection = ({
  koulutus,
  language,
  disabled,
  name,
}: ToteutusTiedotSectionProps) => (
  <VerticalBox gap={2}>
    <NimiSection name={name} language={language} disabled={disabled} />
    <OpintojenLaajuusReadOnlyField
      selectedLanguage={language}
      laajuusKoodiUri={koulutus?.metadata?.opintojenLaajuusKoodiUri}
      laajuusyksikkoKoodiUri={OpintojenLaajuusyksikko.OPINTOPISTE}
      laajuusNumero={koulutus?.metadata?.opintojenLaajuusNumero}
    />
    <CommonTiedotFields name={name} />
  </VerticalBox>
);

export const TutkinnonOsaTiedotSection = ({
  koulutus,
  language,
  disabled,
  name,
}: ToteutusTiedotSectionProps) => (
  <VerticalBox gap={2}>
    <NimiSection name={name} language={language} disabled={disabled} />
    <OpintojenLaajuusReadOnlyField
      selectedLanguage={language}
      laajuusKoodiUri={koulutus?.metadata?.opintojenLaajuusKoodiUri}
      laajuusyksikkoKoodiUri={OpintojenLaajuusyksikko.OSAAMISPISTE}
      laajuusNumero={koulutus?.metadata?.opintojenLaajuusNumero}
    />
    <CommonTiedotFields name={name} />
  </VerticalBox>
);

export const OsaamisalaTiedotSection = ({
  koulutus,
  language,
  name,
}: ToteutusTiedotSectionProps) => (
  <VerticalBox gap={2}>
    <NimiSection name={name} language={language} disabled={true} />
    <OpintojenLaajuusReadOnlyField
      selectedLanguage={language}
      laajuusKoodiUri={koulutus?.metadata?.opintojenLaajuusKoodiUri}
      laajuusyksikkoKoodiUri={OpintojenLaajuusyksikko.OSAAMISPISTE}
      laajuusNumero={koulutus?.metadata?.opintojenLaajuusNumero}
    />
    <CommonTiedotFields name={name} />
  </VerticalBox>
);

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

export const MuuTiedotSection = ({
  name,
  language,
  disabled,
}: ToteutusTiedotSectionProps) => {
  return (
    <VerticalBox gap={2}>
      <NimiSection name={name} language={language} />
      <OpintojenLaajuusFieldRange name={name} disabled={disabled} />
      <CommonTiedotFields name={name} />
    </VerticalBox>
  );
};
