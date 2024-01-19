import React from 'react';

import { useTranslation } from 'react-i18next';

import FormCollapse from '#/src/components/FormCollapse';
import FormCollapseGroup from '#/src/components/FormCollapseGroup';
import { JulkaisutilaField } from '#/src/components/JulkaisutilaField';
import KieliversiotFields from '#/src/components/KieliversiotFields';
import { TeemakuvaOrEsittelyvideoSection } from '#/src/components/TeemakuvaOrEsittelyvideoSection';
import {
  YhteystietoSection,
  YhteystiedotSection,
} from '#/src/components/YhteystiedotSection';
import { useFieldValue } from '#/src/hooks/form';

import EsittelySection from './EsittelySection';
import OppilaitoksenOsatSection from './OppilaitoksenOsatSection';
import { PerustiedotSection } from './PerustiedotSection';
import { TietoaOpiskelustaSection } from './TietoaOpiskelustaSection';

const OppilaitosForm = ({
  steps = false,
  organisaatioOid,
  organisaatio,
  oppilaitos,
}) => {
  const { t } = useTranslation();
  const languageTabs = useFieldValue('kieliversiot');

  return (
    <FormCollapseGroup enabled={steps} defaultOpen={!steps}>
      <FormCollapse
        section="kieliversiot"
        header={t('yleiset.kieliversiot')}
        Component={KieliversiotFields}
      />

      <FormCollapse
        section="perustiedot"
        languages={languageTabs}
        header={t('oppilaitoslomake.oppilaitoksenPerustiedot')}
        Component={PerustiedotSection}
        organisaatioOid={organisaatioOid}
      />

      <FormCollapse
        section="esittely"
        languages={languageTabs}
        header={t('oppilaitoslomake.oppilaitoksenEsittely')}
        Component={EsittelySection}
      />

      <FormCollapse
        languages={languageTabs}
        section="teemakuvaOrEsittelyvideo"
        header={t('oppilaitoslomake.oppilaitoksenTeemakuva')}
        Component={TeemakuvaOrEsittelyvideoSection}
      />

      <FormCollapse
        section="oppilaitoksenOsat"
        header={t('oppilaitoslomake.oppilaitoksenOsat')}
        Component={OppilaitoksenOsatSection}
        organisaatio={organisaatio}
      />

      <FormCollapse
        section="tietoa"
        languages={languageTabs}
        header={t('oppilaitoslomake.tietoaOpiskelusta')}
        Component={TietoaOpiskelustaSection}
      />

      <FormCollapse
        section="yhteystiedot"
        languages={languageTabs}
        header={t('oppilaitoslomake.oppilaitoksenYhteystiedot')}
        Component={YhteystiedotSection}
        organisaatioOid={organisaatioOid}
      />

      <FormCollapse
        section="hakijapalveluidenYhteystiedot"
        languages={languageTabs}
        header={t('oppilaitoslomake.hakijapalveluidenYhteystiedot')}
        description={t('oppilaitoslomake.hakijapalveluidenYhteystiedotOhje')}
        Component={YhteystietoSection}
      />

      <FormCollapse
        section="tila"
        header={t('oppilaitoslomake.oppilaitoksenTila')}
        Component={JulkaisutilaField}
        entity={oppilaitos}
      />
    </FormCollapseGroup>
  );
};

export default OppilaitosForm;
