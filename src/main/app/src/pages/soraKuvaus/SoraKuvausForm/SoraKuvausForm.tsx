import React from 'react';

import { useTranslation } from 'react-i18next';

import FormCollapse from '#/src/components/FormCollapse';
import FormCollapseGroup from '#/src/components/FormCollapseGroup';
import { JulkaisutilaField } from '#/src/components/JulkaisutilaField';
import KieliversiotFields from '#/src/components/KieliversiotFields';
import { OrganisaatioSection } from '#/src/components/OrganisaatioSection';
import PohjaFormCollapse from '#/src/components/PohjaFormCollapse';
import { FormMode } from '#/src/constants';
import { useFormMode } from '#/src/contexts/FormContext';
import { useFieldValue } from '#/src/hooks/form';
import getSoraKuvaukset from '#/src/utils/soraKuvaus/getSoraKuvaukset';

import KoulutustyyppiSection from './KoulutustyyppiSection';
import { TiedotSection } from './TiedotSection';

const SoraKuvausForm = ({
  steps = false,
  canEditKoulutustyyppi = true,
  soraKuvaus = undefined,
  canSelectBase = true,
  organisaatioOid,
  onSelectBase = () => {},
}) => {
  const { t } = useTranslation();
  const kieliversiot = useFieldValue('kieliversiot');
  const languageTabs = kieliversiot || [];

  const formMode = useFormMode();

  return (
    <FormCollapseGroup enabled={steps} defaultOpen={!steps}>
      {formMode === FormMode.EDIT && (
        <FormCollapse
          section="organisaatio"
          Component={OrganisaatioSection}
          header={t('yleiset.organisaatio')}
        />
      )}
      <FormCollapse
        section="koulutustyyppi"
        header={t('yleiset.koulutustyyppi')}
        scrollOnActive={false}
        Component={KoulutustyyppiSection}
        canEditKoulutustyyppi={canEditKoulutustyyppi}
      />
      {canSelectBase ? (
        <PohjaFormCollapse
          onSelectBase={onSelectBase}
          organisaatioOid={organisaatioOid}
          getCopyEntities={getSoraKuvaukset}
          infoText={t('soraKuvauslomake.pohjavalintaInfo')}
          createLabel={t('yleiset.luoUusiSoraKuvaus')}
          copyLabel={t('soraKuvauslomake.kopioiPohjaksi')}
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
        section="tila"
        header={t('soraKuvauslomake.soraKuvauksenTila')}
        Component={JulkaisutilaField}
        entity={soraKuvaus}
      />
    </FormCollapseGroup>
  );
};

export default SoraKuvausForm;
