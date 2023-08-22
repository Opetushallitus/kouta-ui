import React from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldInput } from '#/src/components/formFields';
import { OpintojenLaajuusFieldExtended } from '#/src/components/OpintojenLaajuusFieldExtended';
import { VerticalBox } from '#/src/components/VerticalBox';
import { Box } from '#/src/components/virkailija';
import { AMM_TUTKINTO_KOULUTUSKOODIURIT_WITHOUT_EPERUSTE } from '#/src/constants';
import { useLanguageTab } from '#/src/contexts/LanguageTabContext';
import { useFieldValue } from '#/src/hooks/form';
import { getTestIdProps } from '#/src/utils';
import { koodiUriWithoutVersion } from '#/src/utils/koodi/koodiUriWithoutVersion';

import { EPerusteTiedot } from './EPerusteTiedot';
import { ValitseKoulutusBox } from './ValitseKoulutusBox';
import KoulutusalatField from '../TiedotSection/KoulutusalatField';
import TutkintonimikeField from '../TiedotSection/TutkintonimikeField';

const KoulutusNimiField = ({ name, disabled }) => {
  const language = useLanguageTab();
  const { t } = useTranslation();
  return (
    <Box {...getTestIdProps('nimiInput')}>
      <Field
        disabled={disabled}
        name={`${name}.nimi.${language}`}
        component={FormFieldInput}
        label={t('koulutuslomake.muokkaaKoulutuksenNimea')}
        required
      />
    </Box>
  );
};

// Tietyille koulutus-koodiureille käyttäjä syöttää ePeruste-tyyppiset tiedot, koska
// niillä ei ole vielä ePerusteita
const SyntheticEPerusteTiedotSection = ({
  name,
  disabled,
}: {
  name: string;
  disabled?: boolean;
}) => {
  return (
    <VerticalBox gap={2}>
      <OpintojenLaajuusFieldExtended name={name} disabled={disabled} required />
      <TutkintonimikeField
        name={name}
        disabled={disabled}
        koodisto="tutkintonimikkeet"
      />
      <KoulutusalatField name={name} disabled={disabled} />
      <KoulutusNimiField name={name} disabled={disabled} />
    </VerticalBox>
  );
};

type AmmatillinenTiedotProps = {
  name: string;
  disabled?: boolean;
  language: LanguageCode;
  koulutusLabel?: string;
};

export const WithKoulutusSelect = ({
  name,
  koulutusLabel,
  children,
}: {
  name?: string;
  koulutusLabel?: string;
  children: (props: { koulutus: any }) => React.ReactNode;
}) => {
  const language = useLanguageTab();

  const koulutus = useFieldValue(`${name}.koulutus`)?.value;

  return (
    <Box display="flex" flexDirection="column">
      <ValitseKoulutusBox
        fieldName={`${name}.koulutus`}
        label={koulutusLabel}
        language={language}
      />
      {koulutus && children({ koulutus })}
    </Box>
  );
};

export const useIsAmmTutkintoWithoutEperuste = () => {
  const koulutus = useFieldValue('information.koulutus')?.value;

  return _.includes(
    AMM_TUTKINTO_KOULUTUSKOODIURIT_WITHOUT_EPERUSTE,
    koodiUriWithoutVersion(koulutus)
  );
};

export const AmmatillinenTiedotSection = ({
  name,
  disabled,
  language,
  koulutusLabel,
}: AmmatillinenTiedotProps) => {
  const isAmmTutkintoWithoutEperuste = useIsAmmTutkintoWithoutEperuste();

  return (
    <WithKoulutusSelect name={name} koulutusLabel={koulutusLabel}>
      {({ koulutus }) =>
        isAmmTutkintoWithoutEperuste ? (
          <SyntheticEPerusteTiedotSection disabled={disabled} name={name} />
        ) : (
          <EPerusteTiedot
            name={name}
            selectedKoulutus={koulutus}
            language={language}
            disabled={disabled}
          />
        )
      }
    </WithKoulutusSelect>
  );
};
