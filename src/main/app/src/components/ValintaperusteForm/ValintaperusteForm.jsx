import React from 'react';

import FormCollapse from '../FormCollapse';
import KieliversiotFields from '../KieliversiotFields';
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
import useFieldValue from '../useFieldValue';

const ValintaperusteForm = ({
  steps = true,
  canEditTyyppi = true,
  koulutustyyppi: koulutustyyppiProp,
  onMaybeCopy = () => {},
  canCopy = true,
  organisaatioOid,
  onCreateNew = () => {},
}) => {
  const { t } = useTranslation();
  const kieliversiot = useFieldValue('kieliversiot');
  const languages = kieliversiot || [];
  const tyyppi = useFieldValue('tyyppi');

  const koulutustyyppi =
    tyyppi || koulutustyyppiProp || KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS;

  const isKorkeakoulu = isKorkeakouluKoulutustyyppi(koulutustyyppi);

  return (
    <FormCollapseGroup enabled={steps} defaultOpen={!steps}>
      {canEditTyyppi ? (
        <FormCollapse
          header={t('yleiset.koulutustyyppi')}
          scrollOnActive={false}
          {...getTestIdProps('tyyppiSection')}
        >
          <TyyppiSection name="tyyppi" />
        </FormCollapse>
      ) : null}

      <FormCollapse
        header={t('yleiset.kieliversiot')}
        {...getTestIdProps('kieliversiotSection')}
      >
        <KieliversiotFields name="kieliversiot" />
      </FormCollapse>

      {canCopy ? (
        <FormCollapse
          header={t('yleiset.pohjanValinta')}
          onContinue={onMaybeCopy}
          {...getTestIdProps('pohjaSection')}
        >
          {({ onContinue }) => (
            <PohjaSection
              onContinue={onContinue}
              organisaatioOid={organisaatioOid}
              onCreateNew={onCreateNew}
              name="pohja"
            />
          )}
        </FormCollapse>
      ) : null}

      <FormCollapse
        header={t('valintaperustelomake.hakutavanRajaus')}
        {...getTestIdProps('hakutavanRajausSection')}
      >
        <HakutavanRajausSection name="hakutapa" />
      </FormCollapse>

      <FormCollapse
        header={t('valintaperustelomake.haunKohdejoukonRajaus')}
        {...getTestIdProps('kohdejoukonRajausSection')}
      >
        <KohdejoukonRajausSection name="kohdejoukko" />
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
          {...getTestIdProps('osaamistaustaSection')}
        >
          <OsaamistaustaSection name="osaamistausta" />
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
};

export default ValintaperusteForm;
