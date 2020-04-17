import React from 'react';
import FormCollapse from '../FormCollapse';
import FormCollapseGroup from '../FormCollapseGroup';
import ValintatapaSection from './ValintatapaSection';
import KuvausSection from './KuvausSection';
import { useTranslation } from 'react-i18next';
import SoraKuvausSection from './SoraKuvausSection';
import useFieldValue from '../useFieldValue';
import PerustiedotSection from './PerustiedotSection';
import JulkisuusSection from './JulkisuusSection';
import JulkaisutilaField from '#/src/components/JulkaisutilaField';
import ValintakoeSection from './ValintakoeSection';
import PohjaFormCollapse from '../PohjaFormCollapse';
import getValintaperusteet from '#/src/utils/kouta/getValintaperusteet';

const ValintaperusteForm = ({
  steps = true,
  canEditTyyppi = true,
  canSelectBase = true,
  organisaatioOid,
  onSelectBase,
  showArkistoituTilaOption = true,
}) => {
  const { t } = useTranslation();
  const kieliversiot = useFieldValue('perustiedot.kieliversiot');
  const languages = kieliversiot || [];

  return (
    <FormCollapseGroup enabled={steps} defaultOpen={!steps} configured>
      <FormCollapse
        section="perustiedot"
        header={t('valintaperustelomake.valintaperusteenPerustiedot')}
        scrollOnActive={false}
        Component={PerustiedotSection}
        canEditTyyppi={canEditTyyppi}
      />

      {canSelectBase ? (
        <PohjaFormCollapse
          onSelectBase={onSelectBase}
          organisaatioOid={organisaatioOid}
          getCopyEntities={getValintaperusteet}
          infoText={t('valintaperustelomake.pohjavalintaInfo')}
          createLabel={t('yleiset.luoUusi', {
            entity: t('yleiset.valintaperuste'),
          })}
          copyLabel={t('yleiset.kopioiPohjaksi', {
            entity: t('yleiset.valintaperuste'),
          })}
        />
      ) : null}

      <FormCollapse
        section="kuvaus"
        header={t('valintaperustelomake.valintaperusteenKuvaus')}
        languages={languages}
        Component={KuvausSection}
      />

      <FormCollapse
        section="valintatavat"
        header={t('valintaperustelomake.valintatapa')}
        languages={languages}
        Component={ValintatapaSection}
      />

      <FormCollapse
        section="valintakoe"
        header={t('valintaperustelomake.valintakoe')}
        languages={languages}
        Component={ValintakoeSection}
      />

      <FormCollapse
        section="soraKuvaus"
        header={t('yleiset.soraKuvaus')}
        Component={SoraKuvausSection}
        organisaatioOid={organisaatioOid}
        languages={languages}
      />

      <FormCollapse
        section="julkinen"
        header={t('valintaperustelomake.valintaperusteenNakyminen')}
        Component={JulkisuusSection}
      />

      <FormCollapse
        section="tila"
        header={t('valintaperustelomake.valintaperusteenTila')}
        Component={JulkaisutilaField}
        showArkistoitu={showArkistoituTilaOption}
      />
    </FormCollapseGroup>
  );
};

export default ValintaperusteForm;
