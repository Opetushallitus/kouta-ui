import React from 'react';

import {
  KOULUTUSTYYPPI_CATEGORY,
  KORKEAKOULUKOULUTUSTYYPIT,
} from '../../../constants';

import AmmattilinenTiedotSection from './AmmatillinenTiedotSection';
import KorkeakouluTiedotSection from './KorkeakouluTiedotSection';

const TiedotSection = ({ language, koulutustyyppi, koulutusValue }) => {
  if (koulutustyyppi === KOULUTUSTYYPPI_CATEGORY.AMMATILLINEN_KOULUTUS) {
    return (
      <AmmattilinenTiedotSection
        language={language}
        koulutustyyppi={koulutustyyppi}
        koulutusValue={koulutusValue}
      />
    );
  } else if (KORKEAKOULUKOULUTUSTYYPIT.includes(koulutustyyppi)) {
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
