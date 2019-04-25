import React from 'react';
import { formValues } from 'redux-form';

import FormCollapse from '../FormCollapse';
import KieliversiotFormSection from '../KieliversiotFormSection';

import {
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
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import ValituksiTuleminenSection from './ValituksiTuleminenSection';

const WithLanguagesAndTyyppiValue = formValues({
  languages: 'kieliversiot.languages',
  tyyppi: 'tyyppi.tyyppi',
})(({ languages, children, ...props }) => {
  return children({
    ...props,
    languages: languages || [],
  });
});

const ValintaperusteForm = ({
  handleSubmit,
  steps = true,
  canEditTyyppi = true,
  koulutustyyppi: koulutustyyppiProp,
  onMaybeCopy = () => {},
  canCopy = true,
  organisaatioOid,
  onCreateNew = () => {},
}) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={handleSubmit}>
      <WithLanguagesAndTyyppiValue>
        {({ languages, tyyppi }) => {
          const koulutustyyppi =
            tyyppi ||
            koulutustyyppiProp ||
            KOULUTUSTYYPPI_CATEGORY.AMMATILLINEN_KOULUTUS;

          const isKorkeakoulu = KORKEAKOULUKOULUTUSTYYPIT.includes(
            koulutustyyppi,
          );

          return (
            <FormCollapseGroup enabled={steps} defaultOpen={!steps}>
              {canEditTyyppi ? (
                <FormCollapse
                  header={t('yleiset.koulutustyyppi')}
                  section="tyyppi"
                  scrollOnActive={false}
                  {...getTestIdProps('tyyppiSection')}
                >
                  <TyyppiSection />
                </FormCollapse>
              ) : null}

              <FormCollapse
                header={t('yleiset.kieliversiot')}
                section="kieliversiot"
                {...getTestIdProps('kieliversiotSection')}
              >
                <KieliversiotFormSection />
              </FormCollapse>

              {canCopy ? (
                <FormCollapse
                  header={t('yleiset.pohjanValinta')}
                  section="pohja"
                  onContinue={onMaybeCopy}
                  {...getTestIdProps('pohjaSection')}
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

              <FormCollapse
                header={t('valintaperustelomake.hakutavanRajaus')}
                section="hakutavanRajaus"
                {...getTestIdProps('hakutavanRajausSection')}
              >
                <HakutavanRajausSection />
              </FormCollapse>

              <FormCollapse
                header={t('valintaperustelomake.haunKohdejoukonRajaus')}
                section="kohdejoukonRajaus"
                {...getTestIdProps('kohdejoukonRajausSection')}
              >
                <KohdejoukonRajausSection />
              </FormCollapse>

              <FormCollapse
                header={t('valintaperustelomake.valintaperusteenNimi')}
                section="nimi"
                languages={languages}
                {...getTestIdProps('nimiSection')}
              >
                <NimiSection />
              </FormCollapse>

              <FormCollapse
                header={t(
                  'valintaperustelomake.valituksiTulemisenVahimmaisehdot',
                )}
                section="valituksiTuleminen"
                languages={languages}
                {...getTestIdProps('valituksiTuleminenSection')}
              >
                <ValituksiTuleminenSection />
              </FormCollapse>

              {isKorkeakoulu ? (
                <FormCollapse
                  header={t('valintaperustelomake.osaamistausta')}
                  section="osaamistausta"
                  {...getTestIdProps('osaamistaustaSection')}
                >
                  <OsaamistaustaSection />
                </FormCollapse>
              ) : null}

              <FormCollapse
                header={t('valintaperustelomake.valintatapa')}
                section="valintatapa"
                languages={languages}
                {...getTestIdProps('valintatapaSection')}
              >
                <ValintatapaSection />
              </FormCollapse>

              <FormCollapse
                header={t('valintaperustelomake.kielitaitovaatimukset')}
                section="kielitaitovaatimukset"
                languages={languages}
                {...getTestIdProps('kielitaitovaatimuksetSection')}
              >
                <KielitaitovaatimuksetSection />
              </FormCollapse>

              {isKorkeakoulu ? (
                <FormCollapse
                  header={t('valintaperustelomake.valintaperusteenLoppukuvaus')}
                  section="loppukuvaus"
                  languages={languages}
                  {...getTestIdProps('loppukuvausSection')}
                >
                  <LoppukuvausSection />
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
