import React from 'react';

import {
  KOULUTUSTYYPPI_CATEGORY,
  KORKEAKOULUKOULUTUSTYYPIT,
} from '../../../constants';

import AmmattilinenKuvausSection from './AmmatillinenKuvausSection';
import KorkeakouluKuvausSection from './KorkeakouluKuvausSection';

const KuvausSection = ({ language, koulutusValue, koulutustyyppi }) => {
  if (koulutustyyppi === KOULUTUSTYYPPI_CATEGORY.AMMATILLINEN_KOULUTUS) {
    return (
      <AmmattilinenKuvausSection
        language={language}
        koulutusValue={koulutusValue}
      />
    );
  } else if (KORKEAKOULUKOULUTUSTYYPIT.includes(koulutustyyppi)) {
    return <KorkeakouluKuvausSection language={language} />;
  }

  return null;
};

export default KuvausSection;
