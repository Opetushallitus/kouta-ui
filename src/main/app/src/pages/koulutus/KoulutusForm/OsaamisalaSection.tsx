import React from 'react';

import { Box } from '#/src/components/virkailija';

import { KoulutuksenEPerusteTiedot } from './KoulutuksenEPerusteTiedot';

export const OsaamisalaSection = ({ disabled, language, languages, name }) => {
  return (
    <Box mb={-2}>
      <KoulutuksenEPerusteTiedot
        language={language}
        name={name}
        disabled={disabled}
      />
    </Box>
  );
};
