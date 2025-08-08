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
import { Box } from '#/src/components/virkailija';
import { KOULUTUSTYYPPI, OpintojenLaajuusyksikko } from '#/src/constants';
import { useLanguageTab } from '#/src/contexts/LanguageTabContext';
import { useBoundFormActions, useFieldValue } from '#/src/hooks/form';
import { VaativaErityinenTukiField } from '#/src/pages/toteutus/ToteutusForm/TiedotSection/VaativaErityinenTukiField';
import { ToteutusTiedotSectionProps } from '#/src/types/toteutusTypes';
import { isNumeric } from '#/src/utils';
import { usePerusteenOsat } from '#/src/utils/api/getPerusteenOsat';

import { TaiteenalatField } from './TiedotSection/TaiteenalatField';

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

const OpintojenLaajuus = ({ koulutus, laajuusyksikkoKoodiUri }) => {
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

const OpintojenLaajuusForTutkinnonosat = ({
  koulutus,
  laajuusyksikkoKoodiUri,
}: {
  koulutus: any;
  laajuusyksikkoKoodiUri: string;
}) => {
  const selectedLanguage = useLanguageTab();
  const { t } = useTranslation();
  const tutkinnonOsaIdt = koulutus?.metadata?.tutkinnonOsat || [];

  const { data: tutkinnonOsat } = usePerusteenOsat({ tutkinnonOsaIdt });

  const laajuudet = tutkinnonOsat?.map(osa => osa.laajuus);
  const combinedLaajuudet = laajuudet?.join(' + ') || '';

  return (
    <Box display="flex">
      <Box maxWidth="300px">
        <FixedValueKoodiInput
          selectedLanguage={selectedLanguage}
          koodiUri={laajuusyksikkoKoodiUri}
          label={t('toteutuslomake.laajuus')}
          prefix={combinedLaajuudet}
        />
      </Box>
    </Box>
  );
};

const PieniOsaamiskokonaisuusField = ({
  name,
  koulutus,
}: {
  name: string;
  koulutus?: any;
}) => {
  const { t } = useTranslation();
  const { change } = useBoundFormActions();
  const currValue = useFieldValue(`${name}.isPieniOsaamiskokonaisuus`);
  const toteutuksenLaajuus = useFieldValue(`${name}.opintojenLaajuusNumero`);
  const koulutustyyppi = koulutus?.koulutustyyppi;

  useEffect(() => {
    if (
      _fp.isUndefined(currValue) &&
      (KOULUTUSTYYPPI.TUTKINNON_OSA === koulutustyyppi ||
        ([
          KOULUTUSTYYPPI.KORKEAKOULUTUS_OPINTOJAKSO,
          KOULUTUSTYYPPI.KORKEAKOULUTUS_OPINTOKOKONAISUUS,
        ].includes(koulutustyyppi) &&
          isNumeric(toteutuksenLaajuus) &&
          toteutuksenLaajuus < 60))
    ) {
      change(`${name}.isPieniOsaamiskokonaisuus`, true);
    }
  }, [change, currValue, koulutustyyppi, name, toteutuksenLaajuus]);

  return (
    <Field
      name={`${name}.isPieniOsaamiskokonaisuus`}
      component={FormFieldSwitch}
      helperText={t('toteutuslomake.pieniOsaamiskokonaisuusOhje')}
    >
      {t('toteutuslomake.isPieniOsaamiskokonaisuus')}
    </Field>
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
      <OpintojenLaajuus
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
      <OpintojenLaajuus
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

const CommonVSTFields = ({ name }: CommonTiedotProps) => {
  const { t } = useTranslation();

  return (
    <VerticalBox gap={2}>
      <CommonTiedotFields name={name} />
      <Field name={`${name}.suoritetaanNayttona`} component={FormFieldSwitch}>
        {t('toteutuslomake.suoritetaanNayttona')}
      </Field>
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
      <OpintojenLaajuus
        laajuusyksikkoKoodiUri={
          koulutus?.metadata?.opintojenLaajuusyksikkoKoodiUri
        }
        koulutus={koulutus}
      />
      <CommonVSTFields name={name} />
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
      <OpintojenLaajuus
        koulutus={koulutus}
        laajuusyksikkoKoodiUri={
          koulutus?.metadata?.opintojenLaajuusyksikkoKoodiUri
        }
      />
      <PieniOsaamiskokonaisuusField name={name} />
      <CommonVSTFields name={name} />
    </VerticalBox>
  );
};

export const AmmMuuTiedotSection = VapaaSivistystyoMuuTiedotSection;

export const VapaaSivistystyoOsaamismerkkiTiedotSection = ({
  koulutus,
  language,
  name,
}: ToteutusTiedotSectionProps) => {
  useNimiFromKoulutus({ koulutus, name });

  return (
    <VerticalBox gap={2}>
      <NimiSection name={name} language={language} disabled={false} />
      <PieniOsaamiskokonaisuusField name={name} />
      <CommonVSTFields name={name} />
    </VerticalBox>
  );
};

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
    <PieniOsaamiskokonaisuusField name={name} koulutus={koulutus} />
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
    <PieniOsaamiskokonaisuusField name={name} koulutus={koulutus} />
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
    <OpintojenLaajuus
      koulutus={koulutus}
      laajuusyksikkoKoodiUri={OpintojenLaajuusyksikko.OPINTOPISTE}
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
    <OpintojenLaajuusForTutkinnonosat
      koulutus={koulutus}
      laajuusyksikkoKoodiUri={OpintojenLaajuusyksikko.OSAAMISPISTE}
    />
    <PieniOsaamiskokonaisuusField name={name} koulutus={koulutus} />
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
    <OpintojenLaajuus
      koulutus={koulutus}
      laajuusyksikkoKoodiUri={OpintojenLaajuusyksikko.OSAAMISPISTE}
    />
    <PieniOsaamiskokonaisuusField name={name} />
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

export const ErikoistumiskoulutusTiedotSection = ({
  koulutus,
  language,
  name,
}: ToteutusTiedotSectionProps) => {
  useNimiFromKoulutus({ koulutus, name });

  return (
    <VerticalBox gap={2}>
      <NimiSection name={name} language={language} disabled={false} />
      <PieniOsaamiskokonaisuusField name={name} />
      <CommonTiedotFields name={name} />
    </VerticalBox>
  );
};

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
      <PieniOsaamiskokonaisuusField name={name} />
      <CommonTiedotFields name={name} />
    </VerticalBox>
  );
};
