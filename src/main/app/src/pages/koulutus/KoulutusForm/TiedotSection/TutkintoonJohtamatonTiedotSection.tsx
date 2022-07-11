import React, { useEffect } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldInput } from '#/src/components/formFields';
import OpintojenLaajuusFieldExtended from '#/src/components/OpintojenLaajuusFieldExtended';
import { VerticalBox } from '#/src/components/VerticalBox';
import { KOULUTUS_PERUSOPETUS_KOODIURI } from '#/src/constants';
import { useBoundFormActions, useFieldValue } from '#/src/hooks/form';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';
import { getKoulutustyyppiTranslationKey, getTestIdProps } from '#/src/utils';

import EnforcedKoulutusSelect from './EnforcedKoulutusSelect';
import KoulutusalatField from './KoulutusalatField';
import OpintojenlaajuusField from './OpintojenlaajuusField';

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

export const VapaaSivistystyoTiedotOpistovuosiSection = ({ disabled, language, name }) => {
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
