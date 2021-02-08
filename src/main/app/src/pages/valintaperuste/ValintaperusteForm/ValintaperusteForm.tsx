import React from 'react';

import { useTranslation } from 'react-i18next';

import FormCollapse from '#/src/components/FormCollapse';
import FormCollapseGroup from '#/src/components/FormCollapseGroup';
import JulkaisutilaField from '#/src/components/JulkaisutilaField';
import JulkisuusSection from '#/src/components/JulkisuusSection';
import KokeetTaiLisanaytotSection from '#/src/components/KokeetTaiLisanaytotSection';
import PohjaFormCollapse from '#/src/components/PohjaFormCollapse';
import SoraKuvausSection from '#/src/components/SoraKuvausSection';
import { ENTITY } from '#/src/constants';
import { useFieldValue } from '#/src/hooks/form';
import getValintaperusteet from '#/src/utils/valintaperuste/getValintaperusteet';

import { KuvausSection } from './KuvausSection';
import PerustiedotSection from './PerustiedotSection';
import { ValintatapaSection } from './ValintatapaSection';

type ValintaperusteFormProps = {
  organisaatioOid: string;
  steps?: boolean;
  canEditTyyppi?: boolean;
  canSelectBase?: boolean;
  onSelectBase?: (pohjavalinta: PohjaValinta) => void;
  showArkistoituTilaOption?: boolean;
};

const ValintaperusteForm = ({
  organisaatioOid,
  steps = true,
  canEditTyyppi = true,
  canSelectBase = true,
  onSelectBase,
  showArkistoituTilaOption = true,
}: ValintaperusteFormProps) => {
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
          createLabel={t('yleiset.luoUusiValintaperuste')}
          copyLabel={t('valintaperustelomake.kopioiPohjaksi')}
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
