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
import JulkaisutilaSection from './JulkaisutilaSection';
import PohjaFormCollapse from '../PohjaFormCollapse';

const SoraKuvausForm = ({
  steps = false,
  canEditKoulutustyyppi = true,
  canSelectBase = true,
  organisaatioOid,
  onSelectBase = () => {},
  showArkistoituTilaOption = true,
}) => {
  const { t } = useTranslation();
  const kieliversiot = useFieldValue('kieliversiot');
  const languageTabs = kieliversiot || [];

  return (
    <FormCollapseGroup enabled={steps} defaultOpen={!steps}>
      {canEditKoulutustyyppi ? (
        <FormCollapse
          header={t('yleiset.koulutustyyppi')}
          scrollOnActive={false}
          {...getTestIdProps('tyyppiSection')}
        >
          <KoulutustyyppiSection name="koulutustyyppi" />
        </FormCollapse>
      ) : null}

      {canSelectBase ? (
        <PohjaFormCollapse
          header={t('yleiset.pohjanValinta')}
          onSelectBase={onSelectBase}
          {...getTestIdProps('pohjaSection')}
        >
          <PohjaSection name="pohja" organisaatioOid={organisaatioOid} />
        </PohjaFormCollapse>
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
        <JulkisuusSection name="julkinen" />
      </FormCollapse>

      <FormCollapse
        section="julkaisutila"
        header={t('soraKuvausLomake.soraKuvauksenTila')}
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

export default SoraKuvausForm;
