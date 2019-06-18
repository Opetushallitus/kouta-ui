import React from 'react';

import PohjaSection from './PohjaSection';
import FormCollapseGroup from '../FormCollapseGroup';
import FormCollapse from '../FormCollapse';
import KieliversiotSection from './KieliversiotSection';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import KoulutustyyppiSection from './KoulutustyyppiSection';
import TiedotSection from './TiedotSection';
import JulkisuusSection from './JulkisuusSection';
import useFieldValue from '../useFieldValue';

const SoraKuvausForm = ({
  onCopy = () => {},
  onMaybeCopy = () => {},
  steps = false,
  onCreateNew,
  canCopy = true,
  scrollTarget,
  canEditKoulutustyyppi = true,
}) => {
  const { t } = useTranslation();
  const kieliversiot = useFieldValue('kieliversiot');
  const languageTabs = kieliversiot || [];

  return (
    <FormCollapseGroup
      enabled={steps}
      scrollTarget={scrollTarget}
      defaultOpen={!steps}
    >
      {canEditKoulutustyyppi ? (
        <FormCollapse
          header={t('yleiset.koulutustyyppi')}
          scrollOnActive={false}
          {...getTestIdProps('tyyppiSection')}
        >
          <KoulutustyyppiSection name="koulutustyyppi" />
        </FormCollapse>
      ) : null}

      {canCopy ? (
        <FormCollapse
          header={t('yleiset.pohjanValinta')}
          onContinue={onMaybeCopy}
          {...getTestIdProps('pohjaSection')}
        >
          {({ onContinue }) => (
            <PohjaSection
              name="pohja"
              onContinue={onContinue}
              onCopy={onCopy}
              onCreateNew={onCreateNew}
            />
          )}
        </FormCollapse>
      ) : null}

      <FormCollapse
        header={t('yleiset.kieliversiot')}
        {...getTestIdProps('kieliversiotSection')}
      >
        <KieliversiotSection name="kieliversiot" />
      </FormCollapse>

      <FormCollapse
        header={t('soraKuvausLomake.soraKuvauksenTiedot')}
        languages={languageTabs}
        {...getTestIdProps('tiedotSection')}
      >
        <TiedotSection name="tiedot" />
      </FormCollapse>

      <FormCollapse
        header={t('soraKuvausLomake.soraKuvauksenNayttamiseenLiittyvatTiedot')}
        {...getTestIdProps('julkisuusSection')}
      >
        <JulkisuusSection name="julkisuus" />
      </FormCollapse>
    </FormCollapseGroup>
  );
};

export default SoraKuvausForm;
