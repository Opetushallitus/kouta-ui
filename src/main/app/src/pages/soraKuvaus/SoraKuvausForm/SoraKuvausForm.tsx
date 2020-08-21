import React from 'react';
import { useTranslation } from 'react-i18next';

import { ENTITY } from '#/src/constants';
import { useFieldValue } from '#/src/hooks/form';
import getSoraKuvaukset from '#/src/utils/soraKuvaus/getSoraKuvaukset';
import FormCollapseGroup from '#/src/components/FormCollapseGroup';
import FormCollapse from '#/src/components/FormCollapse';
import JulkisuusSection from '#/src/components/JulkisuusSection';
import JulkaisutilaField from '#/src/components/JulkaisutilaField';
import PohjaFormCollapse from '#/src/components/PohjaFormCollapse';
import KoulutustyyppiSection from './KoulutustyyppiSection';
import TiedotSection from './TiedotSection';
import KieliversiotFields from '#/src/components/KieliversiotFields';

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
          infoText={t('soraKuvauslomake.pohjavalintaInfo')}
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
        Component={KieliversiotFields}
      />
      <FormCollapse
        section="tiedot"
        header={t('soraKuvauslomake.soraKuvauksenTiedot')}
        languages={languageTabs}
        Component={TiedotSection}
      />
      <FormCollapse
        section="julkinen"
        header={t('soraKuvauslomake.nakyminenMuilleToimijoille')}
        Component={JulkisuusSection}
        entity={ENTITY.SORA_KUVAUS}
      />
      <FormCollapse
        section="tila"
        header={t('soraKuvauslomake.soraKuvauksenTila')}
        Component={JulkaisutilaField}
        showArkistoitu={showArkistoituTilaOption}
      />
    </FormCollapseGroup>
  );
};

export default SoraKuvausForm;
