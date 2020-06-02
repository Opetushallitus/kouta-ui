import React from 'react';
import { useTranslation } from 'react-i18next';

import FormCollapseGroup from '#/src/components/FormCollapseGroup';
import FormCollapse from '#/src/components/FormCollapse';
import JulkaisutilaField from '#/src/components/JulkaisutilaField';
import KieliversiotFields from '#/src/components/KieliversiotFields';
import { useFieldValue } from '#/src/hooks/form';
import PerustiedotSection from './PerustiedotSection';
import EsittelySection from './EsittelySection';
import YhteystiedotSection from './YhteystiedotSection';

const OppilaitoksenOsaForm = ({
  steps = false,
  organisaatioOid,
  showArkistoituTilaOption = true,
}) => {
  const { t } = useTranslation();
  const languageTabs = useFieldValue('kieliversiot');

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
        organisaatioOid={organisaatioOid}
      />

      <FormCollapse
        languages={languageTabs}
        header={t('oppilaitoksenOsaLomake.oppilaitoksenOsanEsittely')}
        section="esittely"
        Component={EsittelySection}
      />

      <FormCollapse
        languages={languageTabs}
        header={t('oppilaitoksenOsaLomake.oppilaitoksenOsanYhteystiedot')}
        section="yhteystiedot"
        Component={YhteystiedotSection}
      />

      <FormCollapse
        header={t('oppilaitoksenOsaLomake.oppilaitoksenOsanTila')}
        section="tila"
        Component={JulkaisutilaField}
        showArkistoitu={showArkistoituTilaOption}
      />
    </FormCollapseGroup>
  );
};

export default OppilaitoksenOsaForm;
