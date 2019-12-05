import React from 'react';

import FormCollapse from '../FormCollapse';
import KieliversiotFields from '../KieliversiotFields';
import { KOULUTUSTYYPPI } from '../../constants';
import PohjakoulutusSection from './PohjakoulutusSection';
import PerustiedotSection from './PerustiedotSection';
import AloituspaikatSection from './AloituspaikatSection';
import ValintakoeSection from './ValintakoeSection';
import LiitteetSection from './LiitteetSection';
import FormCollapseGroup from '../FormCollapseGroup';
import KuvausSection from './KuvausSection';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import useFieldValue from '../useFieldValue';
import JulkaisutilaSection from './JulkaisutilaSection';

const HakukohdeForm = ({
  steps = true,
  organisaatioOid,
  haku,
  toteutus,
  koulutustyyppi = KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
  showArkistoituTilaOption = true,
}) => {
  const { t } = useTranslation();
  const kieliversiot = useFieldValue('kieliversiot');
  const languages = kieliversiot || [];

  return (
    <FormCollapseGroup enabled={steps} defaultOpen={!steps} configured>
      <FormCollapse
        section="kieliversiot"
        header={t('yleiset.kieliversiot')}
        scrollOnActive={false}
        {...getTestIdProps('kieliversiotSection')}
      >
        <KieliversiotFields name="kieliversiot" />
      </FormCollapse>

      <FormCollapse
        section="pohjakoulutusvaatimus"
        header={t('hakukohdelomake.pohjakoulutusvaatimus')}
        languages={languages}
        {...getTestIdProps('pohjakoulutusvaatimusSection')}
      >
        <PohjakoulutusSection
          name="pohjakoulutus"
          koulutustyyppi={koulutustyyppi}
        />
      </FormCollapse>

      <FormCollapse
        section="perustiedot"
        header={t('hakukohdelomake.hakukohteenPerustiedot')}
        languages={languages}
        {...getTestIdProps('perustiedotSection')}
      >
        <PerustiedotSection
          name="perustiedot"
          koulutustyyppi={koulutustyyppi}
          haku={haku}
          toteutus={toteutus}
        />
      </FormCollapse>

      <FormCollapse
        section="aloituspaikat"
        header={t('hakukohdelomake.aloituspaikat')}
        {...getTestIdProps('aloituspaikatSection')}
      >
        <AloituspaikatSection
          name="aloituspaikat"
          koulutustyyppi={koulutustyyppi}
        />
      </FormCollapse>

      <FormCollapse
        section="valintaperusteenKuvaus"
        header={t('hakukohdelomake.valintaperusteenKuvaus')}
        {...getTestIdProps('valintaperusteenKuvausSection')}
      >
        <KuvausSection
          organisaatioOid={organisaatioOid}
          name="valintaperusteenKuvaus"
          haku={haku}
          languages={languages}
        />
      </FormCollapse>

      <FormCollapse
        section="valintakoe"
        header={t('hakukohdelomake.valintakoe')}
        languages={languages}
        {...getTestIdProps('valintakoeSection')}
      >
        <ValintakoeSection name="valintakoe" />
      </FormCollapse>

      <FormCollapse
        section="liitteet"
        header={t('hakukohdelomake.tarvittavatLiitteet')}
        languages={languages}
        {...getTestIdProps('liitteetSection')}
      >
        <LiitteetSection name="liitteet" organisaatioOid={organisaatioOid} />
      </FormCollapse>

      <FormCollapse
        section="julkaisutila"
        header={t('hakukohdelomake.hakukohteenTila')}
        {...getTestIdProps('tilaSection')}
      >
        <JulkaisutilaSection
          name="tila"
          showArkistoitu={showArkistoituTilaOption}
        />
      </FormCollapse>
    </FormCollapseGroup>
  );
};

export default HakukohdeForm;
