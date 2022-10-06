import React from 'react';

import { useTranslation } from 'react-i18next';

import { FormCollapse } from '#/src/components/FormCollapse';
import { FormCollapseGroup } from '#/src/components/FormCollapseGroup';
import { JulkaisutilaField } from '#/src/components/JulkaisutilaField';
import { KieliversiotFields } from '#/src/components/KieliversiotFields';
import { OrganisaatioSection } from '#/src/components/OrganisaatioSection';
import PohjaFormCollapse from '#/src/components/PohjaFormCollapse';
import { ENTITY, FormMode, KOULUTUSTYYPPI } from '#/src/constants';
import { useFormMode } from '#/src/contexts/FormContext';
import { useFieldValue } from '#/src/hooks/form';
import { AloituspaikatSection } from '#/src/pages/hakukohde/HakukohdeForm/AloituspaikatSection';
import { searchAllHakukohteet } from '#/src/utils/hakukohde/searchHakukohteet';
import { isDIAkoulutus as isDIA } from '#/src/utils/isDIAkoulutus';
import { isEBkoulutus as isEB } from '#/src/utils/isEBkoulutus';

import { HakukohteenLinjaSection } from './HakukohteenLinjaSection';
import { HakukohteenValintakokeetSection } from './HakukohteenValintakokeetSection';
import { JarjestyspaikkaSection } from './JarjestyspaikkaSection';
import { KuvausSection } from './KuvausSection';
import { LiitteetSection } from './LiitteetSection';
import { PerustiedotSection } from './PerustiedotSection';
import { PohjakoulutusSection } from './PohjakoulutusSection';

const PERUSTIEDOT_NAME = 'perustiedot';

export const HakukohdeForm = ({
  steps = true,
  organisaatioOid,
  haku,
  toteutus,
  tarjoajat,
  koulutustyyppi = KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
  hakukohde = undefined,
}) => {
  const { t } = useTranslation();
  const languages = useFieldValue('kieliversiot') || [];

  const formMode = useFormMode();
  const isDIAkoulutus = isDIA(toteutus?.koulutuksetKoodiUri, koulutustyyppi);

  const isEBkoulutus = isEB(toteutus?.koulutuksetKoodiUri, koulutustyyppi);

  const hakutapa = haku?.hakutapaKoodiUri;

  return (
    <FormCollapseGroup enabled={steps} defaultOpen={!steps}>
      {formMode === FormMode.EDIT && (
        <FormCollapse
          section="organisaatio"
          Component={OrganisaatioSection}
          header={t('yleiset.organisaatio')}
        />
      )}
      {formMode === FormMode.CREATE && (
        <PohjaFormCollapse
          entityType={ENTITY.HAKUKOHDE}
          scrollOnActive={false}
          getCopyEntities={searchAllHakukohteet}
          infoText={t('hakukohdelomake.pohjavalintaInfo')}
          createLabel={t('yleiset.luoUusiHakukohde')}
          copyLabel={t('hakukohdelomake.kopioiPohjaksi')}
          organisaatioOid={organisaatioOid}
        />
      )}
      <FormCollapse
        section="kieliversiot"
        header={t('yleiset.kieliversiot')}
        scrollOnActive={false}
        Component={KieliversiotFields}
      />

      <FormCollapse
        section="pohjakoulutus"
        header={t('hakukohdelomake.pohjakoulutusvaatimus')}
        languages={languages}
        Component={PohjakoulutusSection}
      />

      {koulutustyyppi === KOULUTUSTYYPPI.LUKIOKOULUTUS &&
        !isDIAkoulutus &&
        !isEBkoulutus && (
          <FormCollapse
            section="hakukohteenLinja"
            header={t('hakukohdelomake.hakukohteenLinja')}
            languages={languages}
            Component={HakukohteenLinjaSection}
            toteutus={toteutus}
            nimiFieldPath={`${PERUSTIEDOT_NAME}.nimi`}
          />
        )}

      <FormCollapse
        section={PERUSTIEDOT_NAME}
        header={t('hakukohdelomake.hakukohteenPerustiedot')}
        languages={languages}
        Component={PerustiedotSection}
        koulutustyyppi={koulutustyyppi}
        haku={haku}
        toteutus={toteutus}
      />

      <FormCollapse
        section="aloituspaikat"
        header={t('hakukohdelomake.aloituspaikat')}
        languages={languages}
        Component={AloituspaikatSection}
        koulutustyyppi={koulutustyyppi}
        hakutapa={hakutapa}
      />

      <FormCollapse
        section="valintaperusteenKuvaus"
        header={t('hakukohdelomake.valintaperusteenKuvaus')}
        Component={KuvausSection}
        organisaatioOid={organisaatioOid}
        haku={haku}
        languages={languages}
        koulutustyyppi={koulutustyyppi}
      />

      <FormCollapse
        section="valintakokeet"
        header={t('yleiset.kokeetTaiLisanaytot')}
        languages={languages}
        Component={HakukohteenValintakokeetSection}
      />

      <FormCollapse
        section="liitteet"
        header={t('hakukohdelomake.tarvittavatLiitteet')}
        languages={languages}
        Component={LiitteetSection}
        organisaatioOid={organisaatioOid}
      />

      <FormCollapse
        section="jarjestyspaikkaOid"
        header={t('hakukohdelomake.hakukohteenJarjestyspaikka')}
        tarjoajat={tarjoajat}
        Component={JarjestyspaikkaSection}
      />

      <FormCollapse
        section="tila"
        header={t('hakukohdelomake.hakukohteenTila')}
        Component={JulkaisutilaField}
        entity={hakukohde}
      />
    </FormCollapseGroup>
  );
};
