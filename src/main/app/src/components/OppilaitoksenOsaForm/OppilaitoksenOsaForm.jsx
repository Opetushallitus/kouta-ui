import React from 'react';

import FormCollapseGroup from '../FormCollapseGroup';
import FormCollapse from '../FormCollapse';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import PerustiedotSection from './PerustiedotSection';
import EsittelySection from './EsittelySection';
import YhteystiedotSection from './YhteystiedotSection';
import JulkaisutilaSection from './JulkaisutilaSection';

const languageTabs = ['fi', 'sv', 'en'];

const OppilaitoksenOsaForm = ({
  steps = false,
  organisaatioOid,
  showArkistoituTilaOption = true,
}) => {
  const { t } = useTranslation();

  return (
    <FormCollapseGroup enabled={steps} defaultOpen={!steps}>
      <FormCollapse
        languages={languageTabs}
        header={t('oppilaitoksenOsaLomake.oppilaitoksenOsanPerustiedot')}
        {...getTestIdProps('perustiedotSection')}
      >
        <PerustiedotSection
          name="perustiedot"
          organisaatioOid={organisaatioOid}
        />
      </FormCollapse>

      <FormCollapse
        languages={languageTabs}
        header={t('oppilaitoksenOsaLomake.oppilaitoksenOsanEsittely')}
        {...getTestIdProps('esittelySection')}
      >
        <EsittelySection name="esittely" />
      </FormCollapse>

      <FormCollapse
        languages={languageTabs}
        header={t('oppilaitoksenOsaLomake.oppilaitoksenOsanYhteystiedot')}
        {...getTestIdProps('yhteystiedotSection')}
      >
        <YhteystiedotSection name="yhteystiedot" />
      </FormCollapse>

      <FormCollapse
        header={t('oppilaitoksenOsaLomake.oppilaitoksenOsanTila')}
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

export default OppilaitoksenOsaForm;
