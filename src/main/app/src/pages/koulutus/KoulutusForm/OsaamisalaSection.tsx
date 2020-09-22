import React from 'react';
import { Box } from '#/src/components/virkailija';
import { useFieldValue } from '#/src/hooks/form';
import { useLocalizedKoulutus } from './useLocalizedKoulutus';
import { ValitseKoulutusBox } from './KoulutuksenEPerusteTiedot/ValitseKoulutusBox';
import { ValitseEPerusteBox } from './KoulutuksenEPerusteTiedot/ValitseEPerusteBox';
import { ValitseOsaamisalaBox } from './KoulutuksenEPerusteTiedot/ValitseOsaamisalaBox';
import { useKoulutusByKoodi } from '#/src/utils/koulutus/getKoulutusByKoodi';

export const OsaamisalaSection = ({ disabled, language, name }) => {
  const selectedKoulutus = useFieldValue(`${name}.koulutus`)?.value;
  const selectedEPeruste = useFieldValue(`${name}.eperuste`)?.value;

  const { data: koulutus, isLoading } = useKoulutusByKoodi({
    koodiUri: selectedKoulutus,
  });

  const ePerusteet = koulutus?.ePerusteet;

  const selectedEPerusteData = ePerusteet?.find(
    ({ id }) => id === selectedEPeruste
  );

  useLocalizedKoulutus({
    koulutusFieldName: `${name}.koulutus`,
    nimiFieldName: `information.nimi`,
    language,
  });

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
        />
      ) : undefined}
      {selectedEPeruste ? (
        <ValitseOsaamisalaBox
          fieldName={`${name}.osaamisala`}
          selectedEPeruste={selectedEPeruste}
          language={language}
          osaamisalat={selectedEPerusteData?.osaamisalat}
          koulutusIsLoading={isLoading}
        />
      ) : undefined}
    </Box>
  );
};
