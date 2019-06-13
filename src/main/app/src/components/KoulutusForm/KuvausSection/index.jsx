import React from 'react';

import AmmattilinenKuvausSection from './AmmatillinenKuvausSection';
import KorkeakouluKuvausSection from './KorkeakouluKuvausSection';
import isKorkeakouluKoulutustyyppi from '../../../utils/isKorkeakouluKoulutustyyppi';
import isAmmatillinenKoulutustyyppi from '../../../utils/isAmmatillinenKoulutustyyppi';

const KuvausSection = ({ language, koulutusValue, koulutustyyppi, name }) => {
  if (isAmmatillinenKoulutustyyppi(koulutustyyppi)) {
    return (
      <AmmattilinenKuvausSection
        language={language}
        koulutusValue={koulutusValue}
        name={name}
      />
    );
  } else if (isKorkeakouluKoulutustyyppi(koulutustyyppi)) {
    return <KorkeakouluKuvausSection language={language} name={name} />;
  }

  return null;
};

export default KuvausSection;
