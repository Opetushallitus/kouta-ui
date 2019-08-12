import React from 'react';

import FormCollapseGroup from '../FormCollapseGroup';
import FormCollapse from '../FormCollapse';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import PerustiedotSection from './PerustiedotSection';
import EsittelySection from './EsittelySection';
import OsatSection from './OsatSection';
import TietoaOpiskelustaSection from './TietoaOpiskelustaSection';
import YhteystiedotSection from './YhteystiedotSection';

const languageTabs = ['fi', 'sv', 'en'];

const OppilaitosForm = ({ steps = false, organisaatioOid }) => {
  const { t } = useTranslation();

  return (
    <FormCollapseGroup enabled={steps} defaultOpen={!steps}>
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
        header={t('oppilaitoslomake.oppilaitoksenOsat')}
        {...getTestIdProps('osatSection')}
      >
        <OsatSection name="osat" organisaatioOid={organisaatioOid} />
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
    </FormCollapseGroup>
  );
};

export default OppilaitosForm;
