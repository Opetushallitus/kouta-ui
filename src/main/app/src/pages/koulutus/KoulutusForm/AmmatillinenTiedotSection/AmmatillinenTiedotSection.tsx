import React from 'react';

import _ from 'lodash';

import { OpintojenLaajuusFieldExtended } from '#/src/components/OpintojenLaajuusFieldExtended';
import { VerticalBox } from '#/src/components/VerticalBox';
import { Box } from '#/src/components/virkailija';
import { PELASTUSALAN_AMMATILLISET_KOULUTUSKOODIURIT } from '#/src/constants';
import { useLanguageTab } from '#/src/contexts/LanguageTabContext';
import { useFieldValue } from '#/src/hooks/form';
import { koodiUriWithoutVersion } from '#/src/utils/koodi/koodiUriWithoutVersion';

import { EPerusteTiedot } from './EPerusteTiedot';
import { ValitseKoulutusBox } from './ValitseKoulutusBox';

// Pelastusalan koulutuksille halutaan itse syötettävät ePeruste-tyyppiset tiedot, koska
// niillä ei ole vielä ePerusteita
const SyntheticEPerusteTiedotSection = ({ disabled, name }) => {
  return (
    <VerticalBox gap={2}>
      <OpintojenLaajuusFieldExtended disabled={disabled} name={name} required />
    </VerticalBox>
  );
};

type AmmatillinenTiedotProps = {
  disabled?: boolean;
  language: LanguageCode;
  name?: string;
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

export const AmmatillinenTiedotSection = ({
  disabled,
  language,
  name,
  koulutusLabel,
}: AmmatillinenTiedotProps) => {
  const koulutus = useFieldValue(`${name}.koulutus`)?.value;

  const isPelastusalanKoulutus = _.includes(
    PELASTUSALAN_AMMATILLISET_KOULUTUSKOODIURIT,
    koodiUriWithoutVersion(koulutus)
  );

  return (
    <WithKoulutusSelect name={name} koulutusLabel={koulutusLabel}>
      {({ koulutus }) =>
        isPelastusalanKoulutus ? (
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
