import React from 'react';

import { useTranslation } from 'react-i18next';

import FormCollapse from '#/src/components/FormCollapse';
import FormCollapseGroup from '#/src/components/FormCollapseGroup';
import { JulkaisutilaField } from '#/src/components/JulkaisutilaField';
import KieliversiotFields from '#/src/components/KieliversiotFields';
import { TeemakuvaOrEsittelyvideoSection } from '#/src/components/TeemakuvaOrEsittelyvideoSection';
import {
  YhteystiedotSection,
  YhteystietoSection,
} from '#/src/components/YhteystiedotSection';
import { useFieldValue } from '#/src/hooks/form';

import EsittelySection from './EsittelySection';
import { PerustiedotSection } from './PerustiedotSection';

const OppilaitoksenOsaForm = ({
  steps = false,
  organisaatioOid,
  oppilaitoksenOsa,
}) => {
  const { t } = useTranslation();
  const languageTabs = useFieldValue('kieliversiot');
  const organisaatio = oppilaitoksenOsa?._enrichedData?.organisaatio;

  return (
    <FormCollapseGroup enabled={steps} defaultOpen={!steps}>
      <FormCollapse
        header={t('yleiset.kieliversiot')}
        section="kieliversiot"
        Component={KieliversiotFields}
      />

      <FormCollapse
        languages={languageTabs}
        header={t('oppilaitoksenOsaLomake.oppilaitoksenOsanPerustiedot')}
        section="perustiedot"
        Component={PerustiedotSection}
        organisaatio={organisaatio}
      />

      <FormCollapse
        languages={languageTabs}
        header={t('oppilaitoksenOsaLomake.oppilaitoksenOsanEsittely')}
        section="esittely"
        Component={EsittelySection}
      />

      <FormCollapse
        languages={languageTabs}
        section="teemakuvaOrEsittelyvideo"
        header={t('oppilaitoksenOsaLomake.oppilaitoksenOsanTeemakuva')}
        Component={TeemakuvaOrEsittelyvideoSection}
      />

      <FormCollapse
        languages={languageTabs}
        header={t('oppilaitoksenOsaLomake.oppilaitoksenOsanYhteystiedot')}
        section="yhteystiedot"
        Component={YhteystiedotSection}
        organisaatioOid={organisaatioOid}
        organisaatio={organisaatio}
      />

      <FormCollapse
        section="hakijapalveluidenYhteystiedot"
        languages={languageTabs}
        header={t(
          'oppilaitoksenOsaLomake.oppilaitoksenOsanHakijapalveluidenYhteystiedot'
        )}
        description={t('oppilaitoslomake.hakijapalveluidenYhteystiedotOhje')}
        Component={YhteystietoSection}
      />

      <FormCollapse
        header={t('oppilaitoksenOsaLomake.oppilaitoksenOsanTila')}
        section="tila"
        Component={JulkaisutilaField}
        entity={oppilaitoksenOsa}
      />
    </FormCollapseGroup>
  );
};

export default OppilaitoksenOsaForm;
