import React from 'react';

import LanguageSelector from '../../LanguageSelector';
import { KOULUTUSTYYPPI_CATEGORY, KORKEAKOULUKOULUTUSTYYPIT } from '../../../constants';

import AmmattilinenKuvausSection from './AmmatillinenKuvausSection';
import KorkeakouluKuvausSection from './KorkeakouluKuvausSection';

const KuvausSection = ({ languages = [], koulutusValue, koulutustyyppi }) => {
  return (
      <LanguageSelector languages={languages} defaultValue="fi">
        {({ value: language }) => {
          if (
            koulutustyyppi === KOULUTUSTYYPPI_CATEGORY.AMMATILLINEN_KOULUTUS
          ) {
            return (
              <AmmattilinenKuvausSection
                language={language}
                koulutusValue={koulutusValue}
              />
            );
          } else if (
            KORKEAKOULUKOULUTUSTYYPIT.includes(koulutustyyppi)
          ) {
            return (
              <KorkeakouluKuvausSection
                language={language}
              />
            );
          }

          return null;
        }}
      </LanguageSelector>
  );
};

export default KuvausSection;
