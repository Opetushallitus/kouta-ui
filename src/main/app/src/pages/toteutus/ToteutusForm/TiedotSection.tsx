import React, { useEffect } from 'react';

import FormControl from '@opetushallitus/virkailija-ui-components/FormControl';
import Input from '@opetushallitus/virkailija-ui-components/Input';
import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldInput, FormFieldSwitch } from '#/src/components/formFields';
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
    </VerticalBox>
  );
};

export const VapaaSivistystyoTiedotSection = ({
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
    </VerticalBox>
  );
};

export const AmmMuuTiedotSection = VapaaSivistystyoTiedotSection;

export const KorkeakoulutusOpintojaksoTiedotSection = ({
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
  </VerticalBox>
);

export const KorkeakoulutusOpintokokonaisuusTiedotSection = ({
  language,
  disabled,
  name,
  koulutus,
}: ToteutusTiedotSectionProps) => {
  const { t } = useTranslation();
  const laajuusyksikkoKoodiUri =
    koulutus?.metadata?.opintojenLaajuusyksikkoKoodiUri;
  const { koodi: laajuusyksikko } = useKoodi(laajuusyksikkoKoodiUri);

  const laajuusyksikkoTranslation =
    getKoodiNimiTranslation(laajuusyksikko, language) || '';

  return (
    <VerticalBox gap={2}>
      <NimiSection name={name} language={language} disabled={disabled} />
      <Box display="flex" mx={-1}>
        <Box px={1} flexGrow={1}>
          <Field
            name={`${name}.opintojenLaajuusnumero`}
            component={FormFieldInput}
            label={t('yleiset.laajuus')}
            type="number"
            disabled={disabled}
            required={true}
            {...getTestIdProps('laajuusnumero')}
          />
        </Box>

        <Box px={1} flexGrow={1} {...getTestIdProps('laajuusyksikko')}>
          <FormControl
            label={t('toteutuslomake.laajuusyksikko')}
            disabled={true}
          >
            <Input value={laajuusyksikkoTranslation} />
          </FormControl>
        </Box>
      </Box>
    </VerticalBox>
  );
};

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
    <Box>
      <NimiSection name={name} language={language} disabled={false} />
    </Box>
  );
};

export const EBTiedotSection = DIATiedotSection;
