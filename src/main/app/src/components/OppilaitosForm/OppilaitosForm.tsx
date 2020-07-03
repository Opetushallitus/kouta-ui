import React from 'react';

import FormCollapseGroup from '../FormCollapseGroup';
import FormCollapse from '../FormCollapse';
import { useTranslation } from 'react-i18next';
import PerustiedotSection from './PerustiedotSection';
import EsittelySection from './EsittelySection';
import TietoaOpiskelustaSection from './TietoaOpiskelustaSection';
import YhteystiedotSection from './YhteystiedotSection';
import JulkaisutilaField from '#/src/components/JulkaisutilaField';
import KieliversiotFields from '../KieliversiotFields';
import { useFieldValue } from '#/src/hooks/form';
import TeemakuvaSection from '../TeemakuvaSection';

const OppilaitosForm = ({
  steps = false,
  organisaatioOid,
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
