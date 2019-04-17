import React from 'react';

import KorkeakouluOsaamisalatFields from './KorkeakoulutuOsaamisalatFields';

export const KorkeakouluOsaamisalatSection = ({ language }) => {
  return (
    <KorkeakouluOsaamisalatFields language={language} name="osaamisalat" />
  );
};

export default KorkeakouluOsaamisalatSection;
