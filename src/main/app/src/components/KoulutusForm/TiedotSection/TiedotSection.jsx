import React from 'react';

import AmmattilinenTiedotSection from './AmmatillinenTiedotSection';
import KorkeakouluTiedotSection from './KorkeakouluTiedotSection';
import isKorkeakouluKoulutustyyppi from '../../../utils/isKorkeakouluKoulutustyyppi';
import isAmmatillinenKoulutustyyppi from '../../../utils/isAmmatillinenKoulutustyyppi';

const TiedotSection = ({ language, koulutustyyppi, koulutusValue, name }) => {
  if (isAmmatillinenKoulutustyyppi(koulutustyyppi)) {
    return (
      <AmmattilinenTiedotSection
        language={language}
        koulutustyyppi={koulutustyyppi}
        koulutusValue={koulutusValue}
        name={name}
      />
    );
  } else if (isKorkeakouluKoulutustyyppi(koulutustyyppi)) {
    return (
      <KorkeakouluTiedotSection
        language={language}
        koulutustyyppi={koulutustyyppi}
        name={name}
      />
    );
  }

  return null;
};

export default TiedotSection;
