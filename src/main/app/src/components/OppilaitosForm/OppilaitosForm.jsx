import React from 'react';

import FormCollapseGroup from '../FormCollapseGroup';
import FormCollapse from '../FormCollapse';
import { useTranslation } from 'react-i18next';
import { getTestIdProps } from '../../utils';
import PerustiedotSection from './PerustiedotSection';
import EsittelySection from './EsittelySection';
import TietoaOpiskelustaSection from './TietoaOpiskelustaSection';
import YhteystiedotSection from './YhteystiedotSection';
import JulkaisutilaSection from './JulkaisutilaSection';
import KieliversiotFields from '../KieliversiotFields';
import useFieldValue from '../useFieldValue';
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
        header={t('yleiset.kieliversiot')}
        {...getTestIdProps('kieliversiotSection')}
      >
        <KieliversiotFields name="kieliversiot" />
      </FormCollapse>

      <FormCollapse
        header={t('oppilaitoslomake.oppilaitoksenPerustiedot')}
        {...getTestIdProps('perustiedotSection')}
      >
        <PerustiedotSection
          name="perustiedot"
          organisaatioOid={organisaatioOid}
        />
      </FormCollapse>

      <FormCollapse
        languages={languageTabs}
        header={t('oppilaitoslomake.oppilaitoksenEsittely')}
        {...getTestIdProps('esittelySection')}
      >
        <EsittelySection name="esittely" />
      </FormCollapse>

      <FormCollapse
        section="teemakuva"
        header={t('oppilaitoslomake.oppilaitoksenTeemakuva')}
        {...getTestIdProps('teemakuvaSection')}
      >
        <TeemakuvaSection name="teemakuva" />
      </FormCollapse>

      <FormCollapse
        languages={languageTabs}
        header={t('oppilaitoslomake.tietoaOpiskelusta')}
        {...getTestIdProps('tietoaOpiskelustaSection')}
      >
        <TietoaOpiskelustaSection name="tietoa" />
      </FormCollapse>

      <FormCollapse
        languages={languageTabs}
        header={t('oppilaitoslomake.oppilaitoksenYhteystiedot')}
        {...getTestIdProps('yhteystiedotSection')}
      >
        <YhteystiedotSection name="yhteystiedot" />
      </FormCollapse>

      <FormCollapse
        header={t('oppilaitoslomake.oppilaitoksenTila')}
        {...getTestIdProps('tilaSection')}
      >
        <JulkaisutilaSection
          name="tila"
          showArkistoitu={showArkistoituTilaOption}
        />
      </FormCollapse>
    </FormCollapseGroup>
  );
};

export default OppilaitosForm;
