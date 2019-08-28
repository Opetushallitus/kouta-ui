import React, { useCallback } from 'react';
import get from 'lodash/get';

import FormCollapse from '../FormCollapse';
import FormCollapseGroup from '../FormCollapseGroup';
import ValintatapaSection from './ValintatapaSection';
import PohjaSection from './PohjaSection';
import KuvausSection from './KuvausSection';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import SoraKuvausSection from './SoraKuvausSection';
import useFieldValue from '../useFieldValue';
import PerustiedotSection from './PerustiedotSection';
import JulkisuusSection from './JulkisuusSection';
import JulkaisutilaSection from './JulkaisutilaSection';

const PohjaFormCollapse = ({
  children,
  onContinue,
  onSelectBase,
  ...props
}) => {
  const tapa = useFieldValue('pohja.tapa');
  const valinta = useFieldValue('pohja.valinta');

  const onPohjaContinue = useCallback(() => {
    onContinue();
    onSelectBase({
      tapa,
      valinta: get(valinta, 'value'),
    });
  }, [onSelectBase, tapa, valinta, onContinue]);

  return (
    <FormCollapse onContinue={onPohjaContinue} {...props}>
      {children}
    </FormCollapse>
  );
};

const ValintaperusteForm = ({
  steps = true,
  canEditTyyppi = true,
  canCopy = true,
  organisaatioOid,
  onSelectBase,
  showArkistoituTilaOption = true,
}) => {
  const { t } = useTranslation();
  const kieliversiot = useFieldValue('kieliversiot');
  const languages = kieliversiot || [];

  return (
    <FormCollapseGroup enabled={steps} defaultOpen={!steps} configured>
      <FormCollapse
        section="perustiedot"
        header={t('valintaperustelomake.valintaperusteenPerustiedot')}
        scrollOnActive={false}
        {...getTestIdProps('perustiedotSection')}
      >
        <PerustiedotSection canEditTyyppi={canEditTyyppi} />
      </FormCollapse>

      {canCopy ? (
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
        section="soraKuvaus"
        header={t('yleiset.soraKuvaus')}
        {...getTestIdProps('soraKuvausSection')}
      >
        <SoraKuvausSection
          name="soraKuvaus"
          organisaatioOid={organisaatioOid}
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
