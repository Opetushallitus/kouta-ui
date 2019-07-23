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

const PohjaFormCollapse = ({ children, onSelectBase, ...props }) => {
  const tapa = useFieldValue('pohja.tapa');
  const valinta = useFieldValue('pohja.valinta');

  const onContinue = useCallback(() => {
    onSelectBase({
      tapa,
      valinta: get(valinta, 'value'),
    });
  }, [onSelectBase, tapa, valinta]);

  return (
    <FormCollapse onContinue={onContinue} {...props}>
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
}) => {
  const { t } = useTranslation();
  const kieliversiot = useFieldValue('kieliversiot');
  const languages = kieliversiot || [];

  return (
    <FormCollapseGroup enabled={steps} defaultOpen={!steps}>
      <FormCollapse
        header={t('valintaperustelomake.valintaperusteenPerustiedot')}
        scrollOnActive={false}
        {...getTestIdProps('perustiedotSection')}
      >
        <PerustiedotSection canEditTyyppi={canEditTyyppi} />
      </FormCollapse>

      {canCopy ? (
        <PohjaFormCollapse
          header={t('yleiset.pohjanValinta')}
          onSelectBase={onSelectBase}
          {...getTestIdProps('pohjaSection')}
        >
          <PohjaSection organisaatioOid={organisaatioOid} name="pohja" />
        </PohjaFormCollapse>
      ) : null}

      <FormCollapse
        header={t('valintaperustelomake.valintaperusteenKuvaus')}
        languages={languages}
        {...getTestIdProps('kuvausSection')}
      >
        <KuvausSection name="kuvaus" />
      </FormCollapse>

      <FormCollapse
        header={t('valintaperustelomake.valintatapa')}
        languages={languages}
        {...getTestIdProps('valintatapaSection')}
      >
        <ValintatapaSection name="valintatavat" />
      </FormCollapse>

      <FormCollapse
        header={t('yleiset.soraKuvaus')}
        {...getTestIdProps('soraKuvausSection')}
      >
        <SoraKuvausSection
          name="soraKuvaus"
          organisaatioOid={organisaatioOid}
        />
      </FormCollapse>

      <FormCollapse
        header={t('valintaperustelomake.valintaperusteenNakyminen')}
        {...getTestIdProps('julkisuusSection')}
      >
        <JulkisuusSection name="julkinen" />
      </FormCollapse>
    </FormCollapseGroup>
  );
};

export default ValintaperusteForm;
