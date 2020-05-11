import React from 'react';

import FormCollapseGroup from '../FormCollapseGroup';
import FormCollapse from '../FormCollapse';
import { useTranslation } from 'react-i18next';
import { getTestIdProps } from '../../utils';
import PerustiedotSection from './PerustiedotSection';
import EsittelySection from './EsittelySection';
import YhteystiedotSection from './YhteystiedotSection';
import JulkaisutilaField from '#/src/components/JulkaisutilaField';
import KieliversiotFields from '../KieliversiotFields';
import { useFieldValue } from '#/src/hooks/form';

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
        {...getTestIdProps('kieliversiotSection')}
      >
        <KieliversiotFields name="kieliversiot" />
      </FormCollapse>

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
        <JulkaisutilaField
          name="tila"
          showArkistoitu={showArkistoituTilaOption}
        />
      </FormCollapse>
    </FormCollapseGroup>
  );
};

export default OppilaitoksenOsaForm;
