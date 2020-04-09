import React from 'react';
import FormCollapse from '../FormCollapse';
import FormCollapseGroup from '../FormCollapseGroup';
import ValintatapaSection from './ValintatapaSection';
import PohjaSection from './PohjaSection';
import KuvausSection from './KuvausSection';
import { useTranslation } from 'react-i18next';
import { getTestIdProps } from '../../utils';
import SoraKuvausSection from './SoraKuvausSection';
import useFieldValue from '../useFieldValue';
import PerustiedotSection from './PerustiedotSection';
import JulkisuusSection from './JulkisuusSection';
import JulkaisutilaSection from './JulkaisutilaSection';
import ValintakoeSection from './ValintakoeSection';
import PohjaFormCollapse from '../PohjaFormCollapse';

const ValintaperusteForm = ({
  steps = true,
  canEditTyyppi = true,
  canSelectBase = true,
  organisaatioOid,
  onSelectBase,
  showArkistoituTilaOption = true,
}) => {
  const { t } = useTranslation();
  const kieliversiot = useFieldValue('perustiedot.kieliversiot');
  const languages = kieliversiot || [];

  return (
    <FormCollapseGroup enabled={steps} defaultOpen={!steps} configured>
      <FormCollapse
        section="perustiedot"
        header={t('valintaperustelomake.valintaperusteenPerustiedot')}
        scrollOnActive={false}
        {...getTestIdProps('perustiedotSection')}
      >
        <PerustiedotSection canEditTyyppi={canEditTyyppi} name="perustiedot" />
      </FormCollapse>

      {canSelectBase ? (
        <PohjaFormCollapse
          section="pohja"
          header={t('yleiset.pohjanValinta')}
          onSelectBase={onSelectBase}
          {...getTestIdProps('pohjaSection')}
        >
          <PohjaSection organisaatioOid={organisaatioOid} name="pohja" />
        </PohjaFormCollapse>
      ) : null}

      <FormCollapse
        section="kuvaus"
        header={t('valintaperustelomake.valintaperusteenKuvaus')}
        languages={languages}
        {...getTestIdProps('kuvausSection')}
      >
        <KuvausSection name="kuvaus" />
      </FormCollapse>

      <FormCollapse
        section="valintatapa"
        header={t('valintaperustelomake.valintatapa')}
        languages={languages}
        {...getTestIdProps('valintatapaSection')}
      >
        <ValintatapaSection name="valintatavat" />
      </FormCollapse>

      <FormCollapse
        section="valintakoe"
        header={t('valintaperustelomake.valintakoe')}
        languages={languages}
        {...getTestIdProps('valintakoeSection')}
      >
        <ValintakoeSection name="valintakoe" />
      </FormCollapse>

      <FormCollapse
        section="soraKuvaus"
        header={t('yleiset.soraKuvaus')}
        {...getTestIdProps('soraKuvausSection')}
      >
        <SoraKuvausSection
          name="soraKuvaus"
          organisaatioOid={organisaatioOid}
          languages={languages}
        />
      </FormCollapse>

      <FormCollapse
        section="julkisuus"
        header={t('valintaperustelomake.valintaperusteenNakyminen')}
        {...getTestIdProps('julkisuusSection')}
      >
        <JulkisuusSection name="julkinen" />
      </FormCollapse>

      <FormCollapse
        section="julkaisutila"
        header={t('valintaperustelomake.valintaperusteenTila')}
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

export default ValintaperusteForm;
