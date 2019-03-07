import React from 'react';

import LanguageSelector from '../../LanguageSelector';
import { KOULUTUSTYYPPI_CATEGORY, KORKEAKOULUKOULUTUSTYYPIT } from '../../../constants';

import AmmattilinenTiedotSection from './AmmatillinenTiedotSection';
import KorkeakouluTiedotSection from './KorkeakouluTiedotSection';

const TiedotSection = ({ languages = [], koulutustyyppi, koulutusValue, ...props }) => {
  return (
    <div {...props}>
      <LanguageSelector languages={languages} defaultValue="fi">
        {({ value: language }) => {
          if (
            koulutustyyppi === KOULUTUSTYYPPI_CATEGORY.AMMATILLINEN_KOULUTUS
          ) {
            return (
              <AmmattilinenTiedotSection
                language={language}
                koulutustyyppi={koulutustyyppi}
                koulutusValue={koulutusValue}
              />
            );
          } else if (
            KORKEAKOULUKOULUTUSTYYPIT.includes(koulutustyyppi)
          ) {
            return (
              <KorkeakouluTiedotSection
                language={language}
                koulutustyyppi={koulutustyyppi}
              />
            );
          }

          return null;
        }}
      </LanguageSelector>
    </div>
  );
};

export default TiedotSection;
