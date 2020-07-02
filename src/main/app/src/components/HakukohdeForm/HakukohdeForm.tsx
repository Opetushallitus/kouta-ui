import React from 'react';
import { KOULUTUSTYYPPI } from '#/src/constants';
import FormCollapse from '#/src/components/FormCollapse';
import KieliversiotFields from '#/src/components/KieliversiotFields';
import KokeetTaiLisanaytotSection from '#/src/components/KokeetTaiLisanaytotSection';
import FormCollapseGroup from '#/src/components/FormCollapseGroup';
import { useFieldValue } from '#/src/hooks/form';
import PerustiedotSection from './PerustiedotSection';
import PohjakoulutusSection from './PohjakoulutusSection';
import AloituspaikatSection from './AloituspaikatSection';
import LiitteetSection from './LiitteetSection';
import KuvausSection from './KuvausSection';
import { useTranslation } from 'react-i18next';
import JulkaisutilaField from '#/src/components/JulkaisutilaField';
import JarjestyspaikkaSection from './JarjestyspaikkaSection';

const HakukohdeForm = ({
  steps = true,
  organisaatioOid,
  haku,
  toteutus,
  tarjoajat,
  koulutustyyppi = KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
  showArkistoituTilaOption = true,
}) => {
  const { t } = useTranslation();
  const languages = useFieldValue('kieliversiot') || [];
  const {
    metadata: {
      opetus: { opetustapaKoodiUrit },
    },
  } = toteutus;

  return (
    <FormCollapseGroup enabled={steps} defaultOpen={!steps} configured>
      <FormCollapse
        section="kieliversiot"
        header={t('yleiset.kieliversiot')}
        scrollOnActive={false}
        Component={KieliversiotFields}
      />

      <FormCollapse
        section="pohjakoulutus"
        header={t('hakukohdelomake.pohjakoulutusvaatimus')}
        languages={languages}
        Component={PohjakoulutusSection}
        koulutustyyppi={koulutustyyppi}
      />

      <FormCollapse
        section="perustiedot"
        header={t('hakukohdelomake.hakukohteenPerustiedot')}
        languages={languages}
        Component={PerustiedotSection}
        koulutustyyppi={koulutustyyppi}
        haku={haku}
        toteutus={toteutus}
      />

      <FormCollapse
        section="aloituspaikat"
        header={t('hakukohdelomake.aloituspaikat')}
        Component={AloituspaikatSection}
        koulutustyyppi={koulutustyyppi}
      />

      <FormCollapse
        section="valintaperusteenKuvaus"
        header={t('hakukohdelomake.valintaperusteenKuvaus')}
        Component={KuvausSection}
        organisaatioOid={organisaatioOid}
        haku={haku}
        languages={languages}
      />

      <FormCollapse
        section="valintakokeet"
        header={t('yleiset.kokeetTaiLisanaytot')}
        languages={languages}
        Component={KokeetTaiLisanaytotSection}
      />

      <FormCollapse
        section="liitteet"
        header={t('hakukohdelomake.tarvittavatLiitteet')}
        languages={languages}
        Component={LiitteetSection}
        organisaatioOid={organisaatioOid}
      />

      <FormCollapse
        section="jarjestyspaikkaOid"
        header={t('hakukohdelomake.hakukohteenJarjestyspaikka')}
        tarjoajat={tarjoajat}
        opetustapaKoodiUrit={opetustapaKoodiUrit}
        Component={JarjestyspaikkaSection}
      />

      <FormCollapse
        section="tila"
        header={t('hakukohdelomake.hakukohteenTila')}
        Component={JulkaisutilaField}
        showArkistoitu={showArkistoituTilaOption}
      />
    </FormCollapseGroup>
  );
};

export default HakukohdeForm;
