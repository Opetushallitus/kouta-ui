import React from 'react';
import FormCollapseGroup from '../FormCollapseGroup';
import FormCollapse from '../FormCollapse';
import KieliversiotSection from './KieliversiotSection';
import { useTranslation } from 'react-i18next';
import KoulutustyyppiSection from './KoulutustyyppiSection';
import TiedotSection from './TiedotSection';
import JulkisuusSection from './JulkisuusSection';
import { useFieldValue } from '#/src/hooks/form';
import JulkaisutilaField from '#/src/components/JulkaisutilaField';
import PohjaFormCollapse from '../PohjaFormCollapse';
import getSoraKuvaukset from '#/src/utils/kouta/getSoraKuvaukset';

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
          section="koulutustyyppi"
          header={t('yleiset.koulutustyyppi')}
          scrollOnActive={false}
          Component={KoulutustyyppiSection}
        />
      ) : null}

      {canSelectBase ? (
        <PohjaFormCollapse
          onSelectBase={onSelectBase}
          organisaatioOid={organisaatioOid}
          getCopyEntities={getSoraKuvaukset}
          infoText={t('soraKuvausLomake.pohjavalintaInfo')}
          createLabel={t('yleiset.luoUusi', {
            entity: t('yleiset.soraKuvaus'),
          })}
          copyLabel={t('yleiset.kopioiPohjaksi', {
            entity: t('yleiset.soraKuvaus'),
          })}
        />
      ) : null}

      <FormCollapse
        section="kieliversiot"
        header={t('yleiset.kieliversiot')}
        Component={KieliversiotSection}
      />

      <FormCollapse
        section="tiedot"
        header={t('soraKuvausLomake.soraKuvauksenTiedot')}
        languages={languageTabs}
        Component={TiedotSection}
      />

      <FormCollapse
        section="julkinen"
        header={t('soraKuvausLomake.soraKuvauksenNayttamiseenLiittyvatTiedot')}
        Component={JulkisuusSection}
      />

      <FormCollapse
        section="tila"
        header={t('soraKuvausLomake.soraKuvauksenTila')}
        Component={JulkaisutilaField}
        showArkistoitu={showArkistoituTilaOption}
      />
    </FormCollapseGroup>
  );
};

export default SoraKuvausForm;
