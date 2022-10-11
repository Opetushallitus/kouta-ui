import React from 'react';

import { useTranslation } from 'react-i18next';

import FormCollapse from '#/src/components/FormCollapse';
import FormCollapseGroup from '#/src/components/FormCollapseGroup';
import { JulkaisutilaField } from '#/src/components/JulkaisutilaField';
import JulkisuusSection from '#/src/components/JulkisuusSection';
import { KokeetTaiLisanaytotSection } from '#/src/components/KokeetTaiLisanaytotSection';
import { OrganisaatioSection } from '#/src/components/OrganisaatioSection';
import PohjaFormCollapse from '#/src/components/PohjaFormCollapse';
import { ENTITY, FormMode } from '#/src/constants';
import { useFormMode } from '#/src/contexts/FormContext';
import { useFieldValue } from '#/src/hooks/form';
import { KOULUTUSTYYPIT_WITH_VALINTATAPA } from '#/src/utils/valintaperuste/constants';
import { getValintaperusteet } from '#/src/utils/valintaperuste/getValintaperusteet';

import { HakukelpoisuusSection } from './HakukelpoisuusSection';
import { KuvausSection } from './KuvausSection';
import { LisatiedotSection } from './LisatiedotSection';
import { PerustiedotSection } from './PerustiedotSection';
import { ValintatapaSection } from './ValintatapaSection';

type ValintaperusteFormProps = {
  organisaatioOid: string;
  valintaperuste?: any;
  steps?: boolean;
  canEditTyyppi?: boolean;
};

export const ValintaperusteForm = ({
  organisaatioOid,
  valintaperuste,
  steps = true,
  canEditTyyppi = true,
}: ValintaperusteFormProps) => {
  const { t } = useTranslation();
  const kieliversiot = useFieldValue('perustiedot.kieliversiot');
  const koulutustyyppi = useFieldValue('perustiedot.tyyppi');
  const languages = kieliversiot || [];

  const formMode = useFormMode();

  return (
    <FormCollapseGroup enabled={steps} defaultOpen={!steps}>
      {formMode === FormMode.EDIT && (
        <FormCollapse
          section="organisaatio"
          Component={OrganisaatioSection}
          header={t('yleiset.organisaatio')}
        />
      )}

      {formMode === FormMode.CREATE && (
        <PohjaFormCollapse
          entityType={ENTITY.VALINTAPERUSTE}
          organisaatioOid={organisaatioOid}
          getCopyEntities={getValintaperusteet}
          infoText={t('valintaperustelomake.pohjavalintaInfo')}
          createLabel={t('yleiset.luoUusiValintaperuste')}
          copyLabel={t('valintaperustelomake.kopioiPohjaksi')}
        />
      )}

      <FormCollapse
        section="perustiedot"
        header={t('valintaperustelomake.valintaperusteenPerustiedot')}
        scrollOnActive={false}
        Component={PerustiedotSection}
        canEditTyyppi={canEditTyyppi}
        organisaatioOid={organisaatioOid}
      />

      <FormCollapse
        section="hakukelpoisuus"
        header={t('valintaperustelomake.valintaperusteenHakukelpoisuus')}
        languages={languages}
        Component={HakukelpoisuusSection}
      />

      <FormCollapse
        section="kuvaus"
        header={t('valintaperustelomake.valintaperusteenKuvaus')}
        languages={languages}
        Component={KuvausSection}
      />

      {koulutustyyppi && (
        <>
          {KOULUTUSTYYPIT_WITH_VALINTATAPA.includes(koulutustyyppi) && (
            <FormCollapse
              section="valintatavat"
              header={t('valintaperustelomake.valintatapa')}
              languages={languages}
              Component={ValintatapaSection}
            />
          )}

          <FormCollapse
            section="valintakokeet"
            header={t('yleiset.kokeetTaiLisanaytot')}
            languages={languages}
            Component={KokeetTaiLisanaytotSection}
          />

          <FormCollapse
            section="lisatiedot"
            header={t('valintaperustelomake.valintaperusteenLisatiedot')}
            languages={languages}
            Component={LisatiedotSection}
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
            entity={valintaperuste}
          />
        </>
      )}
    </FormCollapseGroup>
  );
};
