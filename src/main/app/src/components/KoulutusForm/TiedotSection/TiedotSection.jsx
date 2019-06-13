import React from 'react';

import AmmattilinenTiedotSection from './AmmatillinenTiedotSection';
import KorkeakouluTiedotSection from './KorkeakouluTiedotSection';
import isKorkeakouluKoulutustyyppi from '../../../utils/isKorkeakouluKoulutustyyppi';
import isAmmatillinenKoulutustyyppi from '../../../utils/isAmmatillinenKoulutustyyppi';

const TiedotSection = ({ language, koulutustyyppi, koulutusValue }) => {
  if (isAmmatillinenKoulutustyyppi(koulutustyyppi)) {
    return (
      <AmmattilinenTiedotSection
        language={language}
        koulutustyyppi={koulutustyyppi}
        koulutusValue={koulutusValue}
      />
    );
  } else if (isKorkeakouluKoulutustyyppi(koulutustyyppi)) {
    return (
      <KorkeakouluTiedotSection
        language={language}
        koulutustyyppi={koulutustyyppi}
      />
    );
  }

  return null;
};

export default TiedotSection;
