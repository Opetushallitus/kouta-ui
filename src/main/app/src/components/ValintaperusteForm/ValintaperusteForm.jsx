import React from 'react';
import { formValues } from 'redux-form';

import FormCollapse from '../FormCollapse';
import KieliversiotFormSection from '../KieliversiotFormSection';

import { KOULUTUSTYYPPI } from '../../constants';
import FormCollapseGroup from '../FormCollapseGroup';
import KohdejoukonRajausSection from './KohdejoukonRajausSection';
import HakutavanRajausSection from './HakutavanRajausSection';
import ValintatapaSection from './ValintatapaSection';
import PohjaSection from './PohjaSection';
import KielitaitovaatimuksetSection from './KielitaitovaatimuksetSection';
import KuvausSection from './KuvausSection';
import OsaamistaustaSection from './OsaamistaustaSection';
import TyyppiSection from './TyyppiSection';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import SoraKuvausSection from './SoraKuvausSection';
import isKorkeakouluKoulutustyyppi from '../../utils/isKorkeakouluKoulutustyyppi';

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
            KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS;

          const isKorkeakoulu = isKorkeakouluKoulutustyyppi(
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
                header={t('valintaperustelomake.valintaperusteenKuvaus')}
                languages={languages}
                {...getTestIdProps('kuvausSection')}
              >
                <KuvausSection name="kuvaus" />
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
                languages={languages}
                {...getTestIdProps('valintatapaSection')}
              >
                <ValintatapaSection name="valintatavat" />
              </FormCollapse>

              <FormCollapse
                header={t('valintaperustelomake.kielitaitovaatimukset')}
                languages={languages}
                {...getTestIdProps('kielitaitovaatimuksetSection')}
              >
                <KielitaitovaatimuksetSection name="kielitaitovaatimukset" />
              </FormCollapse>

              <FormCollapse
                header={t('yleiset.soraKuvaus')}
                {...getTestIdProps('soraKuvausSection')}
              >
                <SoraKuvausSection
                  name="soraKuvaus"
                  organisaatioOid={organisaatioOid}
                />
              </FormCollapse>
            </FormCollapseGroup>
          );
        }}
      </WithLanguagesAndTyyppiValue>
    </form>
  );
};

export default ValintaperusteForm;
