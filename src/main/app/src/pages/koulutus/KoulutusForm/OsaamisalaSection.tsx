import React, { useEffect } from 'react';

import _fp from 'lodash/fp';

import { Box } from '#/src/components/virkailija';
import {
  useBoundFormActions,
  useFieldValue,
  useIsDirty,
} from '#/src/hooks/form';
import { useHasChanged } from '#/src/hooks/useHasChanged';
import { useKoulutusByKoodi } from '#/src/utils/koulutus/getKoulutusByKoodi';

import { ValitseEPerusteBox } from './KoulutuksenEPerusteTiedot/ValitseEPerusteBox';
import { ValitseKoulutusBox } from './KoulutuksenEPerusteTiedot/ValitseKoulutusBox';
import { ValitseOsaamisalaBox } from './KoulutuksenEPerusteTiedot/ValitseOsaamisalaBox';

export const OsaamisalaSection = ({ disabled, language, languages, name }) => {
  const selectedKoulutus = useFieldValue(`${name}.koulutus`)?.value;
  const selectedEPeruste = useFieldValue(`${name}.eperuste`)?.value;

  const { data: koulutus, isLoading } = useKoulutusByKoodi({
    koodiUri: selectedKoulutus,
  });

  const ePerusteet = koulutus?.ePerusteet;

  const selectedEPerusteData = ePerusteet?.find(
    ({ id }) => id === selectedEPeruste
  );

  const osaamisalaValue = useFieldValue(`${name}.osaamisala`);

  const osaamisalaChanged = useHasChanged(osaamisalaValue);

  const { change } = useBoundFormActions();
  const isDirty = useIsDirty();

  const osaamisalat = selectedEPerusteData?.osaamisalat;

  useEffect(() => {
    if (isDirty && osaamisalaChanged) {
      const selectedOsaamisalaData = _fp.find(
        osaamisala => osaamisala?.arvo === osaamisalaValue?.value,
        osaamisalat
      );
      if (selectedOsaamisalaData) {
        change(
          'information.nimi',
          _fp.pick(languages, selectedOsaamisalaData?.nimi)
        );
      } else {
        change('information.nimi', {});
      }
    }
  }, [
    change,
    isDirty,
    languages,
    osaamisalaChanged,
    osaamisalaValue,
    osaamisalat,
  ]);

  return (
    <Box mb={-2}>
      <ValitseKoulutusBox fieldName={`${name}.koulutus`} language={language} />
      {selectedKoulutus ? (
        <ValitseEPerusteBox
          fieldName={`${name}.eperuste`}
          ePerusteet={ePerusteet}
          selectedKoulutus={selectedKoulutus}
          language={language}
          koulutusIsLoading={isLoading}
          disabled={disabled}
        />
      ) : undefined}
      {selectedEPeruste ? (
        <ValitseOsaamisalaBox
          fieldName={`${name}.osaamisala`}
          selectedEPeruste={selectedEPeruste}
          language={language}
          osaamisalat={selectedEPerusteData?.osaamisalat}
          koulutusIsLoading={isLoading}
          disabled={disabled}
        />
      ) : undefined}
    </Box>
  );
};
