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
import { useTranslation } from 'react-i18next';
import useFieldValue from '../useFieldValue';
import JulkaisutilaField from '#/src/components/JulkaisutilaField';

const HakukohdeForm = ({
  steps = true,
  organisaatioOid,
  haku,
  toteutus,
  koulutustyyppi = KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
  showArkistoituTilaOption = true,
}) => {
  const { t } = useTranslation();
  const languages = useFieldValue('kieliversiot') || [];

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
        section="valintakoe"
        header={t('hakukohdelomake.valintakoe')}
        languages={languages}
        Component={ValintakoeSection}
      />

      <FormCollapse
        section="liitteet"
        header={t('hakukohdelomake.tarvittavatLiitteet')}
        languages={languages}
        Component={LiitteetSection}
        organisaatioOid={organisaatioOid}
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
