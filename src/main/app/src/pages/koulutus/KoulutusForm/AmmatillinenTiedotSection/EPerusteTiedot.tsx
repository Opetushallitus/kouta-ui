import React, { useMemo } from 'react';

import { find, toString } from 'lodash-es';

import { Box } from '#/src/components/virkailija';
import { KOULUTUSTYYPPI } from '#/src/constants';
import { useFieldValue } from '#/src/hooks/form';
import { useKoulutusByKoodi } from '#/src/utils/koulutus/getKoulutusByKoodi';

import { ValitseEPerusteBox } from './ValitseEPerusteBox';
import { ValitseOsaamisalaBox } from './ValitseOsaamisalaBox';
import { ValitseTutkinnonOsatBox } from './ValitseTutkinnonOsatBox';

export const EPerusteTiedot = ({
  selectedKoulutus,
  language,
  name,
  disabled,
}) => {
  const languages =
    useFieldValue<Array<LanguageCode> | undefined>('kieliversiot') || [];

  const selectedEPerusteId = useFieldValue<SelectOption<string> | undefined>(
    `${name}.eperuste`
  )?.value;

  const { data: koulutus, status } = useKoulutusByKoodi({
    koodiUri: selectedKoulutus,
  });

  const koulutusIsLoading = status === 'loading';

  const ePerusteet = koulutus?.ePerusteet;

  const selectedEPeruste = useMemo(
    () =>
      find(
        ePerusteet,
        ePeruste =>
          ePeruste.id.toString() === toString(selectedEPerusteId ?? '')
      ),
    [ePerusteet, selectedEPerusteId]
  );

  const koulutustyyppi = useFieldValue<KOULUTUSTYYPPI | undefined>(
    'koulutustyyppi'
  );
  return (
    <Box>
      {selectedKoulutus && (
        <ValitseEPerusteBox
          fieldName={`${name}.eperuste`}
          ePerusteet={ePerusteet}
          selectedKoulutus={selectedKoulutus}
          language={language}
          koulutusQueryStatus={status}
          disabled={disabled}
        />
      )}

      {koulutustyyppi === KOULUTUSTYYPPI.TUTKINNON_OSA &&
        selectedEPerusteId && (
          <ValitseTutkinnonOsatBox
            fieldName={`${name}.osat`}
            disabled={disabled}
            ePeruste={selectedEPeruste}
            language={language}
          />
        )}

      {koulutustyyppi === KOULUTUSTYYPPI.OSAAMISALA && selectedEPerusteId && (
        <ValitseOsaamisalaBox
          fieldName={`${name}.osaamisala`}
          disabled={disabled}
          language={language}
          koulutusIsLoading={koulutusIsLoading}
          selectedEPeruste={selectedEPeruste}
          languages={languages}
        />
      )}
    </Box>
  );
};
