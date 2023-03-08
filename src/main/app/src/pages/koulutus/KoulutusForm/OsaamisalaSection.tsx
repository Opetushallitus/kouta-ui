import React from 'react';

import { Box } from '#/src/components/virkailija';

import { WithKoulutusSelect } from './AmmatillinenTiedotSection/AmmatillinenTiedotSection';
import { EPerusteTiedot } from './AmmatillinenTiedotSection/EPerusteTiedot';

export const OsaamisalaSection = ({ disabled, language, name }) => {
  return (
    <Box mb={-2}>
      <WithKoulutusSelect name={name}>
        {({ koulutus }) => (
          <EPerusteTiedot
            language={language}
            name={name}
            disabled={disabled}
            selectedKoulutus={koulutus}
          />
        )}
      </WithKoulutusSelect>
    </Box>
  );
};
