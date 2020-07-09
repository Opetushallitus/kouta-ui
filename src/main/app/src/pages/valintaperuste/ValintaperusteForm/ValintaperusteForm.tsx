import React from 'react';
import { useTranslation } from 'react-i18next';

import { ENTITY } from '#/src/constants';
import { useFieldValue } from '#/src/hooks/form';
import getValintaperusteet from '#/src/utils/valintaperuste/getValintaperusteet';
import FormCollapseGroup from '#/src/components/FormCollapseGroup';
import FormCollapse from '#/src/components/FormCollapse';
import PohjaFormCollapse from '#/src/components/PohjaFormCollapse';
import JulkaisutilaField from '#/src/components/JulkaisutilaField';
import JulkisuusSection from '#/src/components/JulkisuusSection';
import KokeetTaiLisanaytotSection from '#/src/components/KokeetTaiLisanaytotSection';
import ValintatapaSection from './ValintatapaSection';
import KuvausSection from './KuvausSection';
import SoraKuvausSection from './SoraKuvausSection';
import PerustiedotSection from './PerustiedotSection';

const ValintaperusteForm = ({
  steps = true,
  canEditTyyppi = true,
  canSelectBase = true,
  organisaatioOid,
  onSelectBase = undefined,
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
        section="valintakokeet"
        header={t('yleiset.kokeetTaiLisanaytot')}
        languages={languages}
        Component={KokeetTaiLisanaytotSection}
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
        header={t('valintaperustelomake.nakyminenMuilleToimijoille')}
        Component={JulkisuusSection}
        entity={ENTITY.VALINTAPERUSTE}
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
