import React from 'react';
import { useTranslation } from 'react-i18next';

import FormCollapseGroup from '#/src/components/FormCollapseGroup';
import FormCollapse from '#/src/components/FormCollapse';
import JulkaisutilaField from '#/src/components/JulkaisutilaField';
import KieliversiotFields from '#/src/components/KieliversiotFields';
import { useFieldValue } from '#/src/hooks/form';
import TeemakuvaSection from '#/src/components/TeemakuvaSection';
import EsittelySection from './EsittelySection';
import PerustiedotSection from './PerustiedotSection';
import YhteystiedotSection from './YhteystiedotSection';
import TietoaOpiskelustaSection from './TietoaOpiskelustaSection';
import OppilaitoksenOsatSection from './OppilaitoksenOsatSection';

const OppilaitosForm = ({
  steps = false,
  organisaatioOid,
  organisaatio,
  showArkistoituTilaOption = true,
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
        section="teemakuva"
        header={t('oppilaitoslomake.oppilaitoksenTeemakuva')}
        Component={TeemakuvaSection}
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
      />

      <FormCollapse
        section="tila"
        header={t('oppilaitoslomake.oppilaitoksenTila')}
        Component={JulkaisutilaField}
        showArkistoitu={showArkistoituTilaOption}
      />
    </FormCollapseGroup>
  );
};

export default OppilaitosForm;
