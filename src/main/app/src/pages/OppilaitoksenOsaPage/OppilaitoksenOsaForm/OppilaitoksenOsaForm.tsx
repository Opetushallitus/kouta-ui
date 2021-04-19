import React from 'react';

import { useTranslation } from 'react-i18next';

import FormCollapse from '#/src/components/FormCollapse';
import FormCollapseGroup from '#/src/components/FormCollapseGroup';
import JulkaisutilaField from '#/src/components/JulkaisutilaField';
import KieliversiotFields from '#/src/components/KieliversiotFields';
import TeemakuvaSection from '#/src/components/TeemakuvaSection';
import { YhteystiedotSection } from '#/src/components/YhteystiedotSection';
import { useFieldValue } from '#/src/hooks/form';

import EsittelySection from './EsittelySection';
import { PerustiedotSection } from './PerustiedotSection';

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
        section="teemakuva"
        header={t('oppilaitoksenOsaLomake.oppilaitoksenOsanTeemakuva')}
        Component={TeemakuvaSection}
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
