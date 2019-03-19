import React from 'react';
import { formValues } from 'redux-form';

import FormCollapse from '../FormCollapse';
import KieliversiotFormSection from '../KieliversiotFormSection';

import {
  LANGUAGE_TABS,
  KOULUTUSTYYPPI_CATEGORY,
  KORKEAKOULUKOULUTUSTYYPIT,
} from '../../constants';

import FormCollapseGroup from '../FormCollapseGroup';
import KohdejoukonRajausSection from './KohdejoukonRajausSection';
import HakutavanRajausSection from './HakutavanRajausSection';
import NimiSection from './NimiSection';
import ValintatapaSection from './ValintatapaSection';
import PohjaSection from './PohjaSection';
import KielitaitovaatimuksetSection from './KielitaitovaatimuksetSection';
import LoppukuvausSection from './LoppukuvausSection';
import OsaamistaustaSection from './OsaamistaustaSection';
import TyyppiSection from './TyyppiSection';

const WithLanguagesAndTyyppiValue = formValues({
  languages: 'kieliversiot.languages',
  tyyppi: 'tyyppi.tyyppi',
})(({ languages, children, ...props }) => {
  const activeLanguages = languages || [];

  return children({
    ...props,
    languages: LANGUAGE_TABS.filter(({ value }) =>
      activeLanguages.includes(value),
    ),
  });
});

const ValintaperusteForm = ({
  handleSubmit,
  steps = true,
  canEditTyyppi = true,
  koulutustyyppi: koulutustyyppiProp = KOULUTUSTYYPPI_CATEGORY.AMMATILLINEN_KOULUTUS,
  onMaybeCopy = () => {},
  canCopy = true,
  organisaatioOid,
  onCreateNew = () => {},
}) => {

  return (
    <form onSubmit={handleSubmit}>
      <WithLanguagesAndTyyppiValue>
        {({ languages, tyyppi }) => {
          const koulutustyyppi = tyyppi || koulutustyyppiProp;
          const isKorkeakoulu = KORKEAKOULUKOULUTUSTYYPIT.includes(koulutustyyppi);

          return (
            <FormCollapseGroup enabled={steps}>
              {canEditTyyppi ? (
                <FormCollapse header="Koulutustyyppi" section="tyyppi">
                  <TyyppiSection />
                </FormCollapse>
              ) : null}
  
              <FormCollapse header="Kieliversiot" section="kieliversiot">
                <KieliversiotFormSection />
              </FormCollapse>
  
              {canCopy ? (
                <FormCollapse
                  header="Pohjan valinta"
                  section="pohja"
                  onContinue={onMaybeCopy}
                >
                  {({ onContinue }) => (
                    <PohjaSection
                      onContinue={onContinue}
                      organisaatioOid={organisaatioOid}
                      onCreateNew={onCreateNew}
                    />
                  )}
                </FormCollapse>
              ) : null}
  
              <FormCollapse header="Hakutavan rajaus" section="hakutavanRajaus">
                <HakutavanRajausSection />
              </FormCollapse>
  
              <FormCollapse
                header="Haun kohdejoukon rajaus"
                section="kohdejoukonRajaus"
              >
                <KohdejoukonRajausSection />
              </FormCollapse>
  
              <FormCollapse header="Valintaperusteen nimi" section="nimi">
                <NimiSection languages={languages} />
              </FormCollapse>
  
              {isKorkeakoulu ? (
                <FormCollapse header="Osaamistausta" section="osaamistausta">
                  <OsaamistaustaSection />
                </FormCollapse>
              ) : null}
  
              <FormCollapse header="Valintatapa" section="valintatapa">
                <ValintatapaSection languages={languages} />
              </FormCollapse>
  
              <FormCollapse
                header="Kielitaitovaatimukset"
                section="kielitaitovaatimukset"
              >
                <KielitaitovaatimuksetSection languages={languages} />
              </FormCollapse>
  
              {isKorkeakoulu ? (
                <FormCollapse
                  header="Valintaperusteen loppukuvaus"
                  section="loppukuvaus"
                >
                  <LoppukuvausSection languages={languages} />
                </FormCollapse>
              ) : null}
            </FormCollapseGroup>
          );
        }}
      </WithLanguagesAndTyyppiValue>
    </form>
  );
};

export default ValintaperusteForm;
