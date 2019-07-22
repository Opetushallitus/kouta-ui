import React from 'react';

import FormCollapse from '../FormCollapse';
import KieliversiotFields from '../KieliversiotFields';
import { KOULUTUSTYYPPI } from '../../constants';
import PohjakoulutusSection from './PohjakoulutusSection';
import PerustiedotSection from './PerustiedotSection';
import AloituspaikatSection from './AloituspaikatSection';
import ValintakoeSection from './ValintakoeSection';
import LiitteetSection from './LiitteetSection';
import FormCollapseGroup from '../FormCollapseGroup';
import KuvausSection from './KuvausSection';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import useFieldValue from '../useFieldValue';

const HakukohdeForm = ({
  steps = true,
  organisaatioOid,
  organisaatio,
  haku,
  toteutus,
  koulutustyyppi = KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
}) => {
  const { t } = useTranslation();
  const kieliversiot = useFieldValue('kieliversiot');
  const languages = kieliversiot || [];

  return (
    <FormCollapseGroup enabled={steps} defaultOpen={!steps}>
      <FormCollapse
        header={t('yleiset.kieliversiot')}
        scrollOnActive={false}
        {...getTestIdProps('kieliversiotSection')}
      >
        <KieliversiotFields name="kieliversiot" />
      </FormCollapse>

      <FormCollapse
        header={t('hakukohdelomake.pohjakoulutusvaatimus')}
        {...getTestIdProps('pohjakoulutusvaatimusSection')}
      >
        <PohjakoulutusSection
          name="pohjakoulutus"
          koulutustyyppi={koulutustyyppi}
        />
      </FormCollapse>

      <FormCollapse
        header={t('hakukohdelomake.hakukohteenPerustiedot')}
        languages={languages}
        {...getTestIdProps('perustiedotSection')}
      >
        <PerustiedotSection
          name="perustiedot"
          koulutustyyppi={koulutustyyppi}
          haku={haku}
          toteutus={toteutus}
        />
      </FormCollapse>

      <FormCollapse
        header={t('hakukohdelomake.aloituspaikat')}
        {...getTestIdProps('aloituspaikatSection')}
      >
        <AloituspaikatSection
          name="aloituspaikat"
          koulutustyyppi={koulutustyyppi}
        />
      </FormCollapse>

      <FormCollapse
        header={t('hakukohdelomake.valintaperusteenKuvaus')}
        {...getTestIdProps('valintaperusteenKuvausSection')}
      >
        <KuvausSection
          organisaatio={organisaatio}
          name="valintaperusteenKuvaus"
          haku={haku}
        />
      </FormCollapse>

      <FormCollapse
        header={t('hakukohdelomake.valintakoe')}
        languages={languages}
        {...getTestIdProps('valintakoeSection')}
      >
        <ValintakoeSection name="valintakoe" />
      </FormCollapse>

      <FormCollapse
        header={t('hakukohdelomake.tarvittavatLiitteet')}
        languages={languages}
        {...getTestIdProps('liitteetSection')}
      >
        <LiitteetSection name="liitteet" organisaatioOid={organisaatioOid} />
      </FormCollapse>
    </FormCollapseGroup>
  );
};

export default HakukohdeForm;
