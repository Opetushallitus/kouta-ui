import React from 'react';

import { useTranslation } from 'react-i18next';

import { FormCollapse } from '#/src/components/FormCollapse';
import { FormCollapseGroup } from '#/src/components/FormCollapseGroup';
import { JulkaisutilaField } from '#/src/components/JulkaisutilaField';
import { KieliversiotFields } from '#/src/components/KieliversiotFields';
import { OrganisaatioSection } from '#/src/components/OrganisaatioSection';
import { OrganisaatioSectionCreate } from '#/src/components/OrganisaatioSectionCreate';
import PohjaFormCollapse from '#/src/components/PohjaFormCollapse';
import {
  ENTITY,
  FormMode,
  JULKAISUTILA,
  KOULUTUSTYYPPI,
} from '#/src/constants';
import { useFormMode } from '#/src/contexts/FormContext';
import {
  useFieldValue,
  useInitalFieldValue,
  useSetFieldValue,
} from '#/src/hooks/form';
import useHakukohdeInfo from '#/src/hooks/useHakukohdeInfo';
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

const onkoHakuaikaMenossa = hakuaika => {
  if (!hakuaika?.alkaa) return false;

  const alkaa = hakuaika?.alkaa && new Date(hakuaika?.alkaa);
  const paattyy = hakuaika?.paattyy && new Date(hakuaika?.paattyy);
  const now = new Date();

  return (alkaa <= now && !paattyy) || (alkaa <= now && now <= paattyy);
};

const isHakukohteenHakuaikaMenossa = (hakuajat, eriHakuaika) => {
  return eriHakuaika && hakuajat?.some(ha => onkoHakuaikaMenossa(ha));
};

const isArkistoituToPoistettuAllowed = (
  hakukohde,
  haku,
  hakukohteenHakuaikaMenossa,
  eriHakuaika,
  hakukohdeInfo,
  isLoading
) => {
  const haunHakuaikaMenossa =
    haku?.hakuajat?.some(ha => onkoHakuaikaMenossa(ha)) && eriHakuaika;

  const hakuaikaMenossa = hakukohteenHakuaikaMenossa || haunHakuaikaMenossa;

  return !isLoading && !hakuaikaMenossa && hakukohdeInfo?.hakemustenMaara === 0;
};

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

  const hakuajatField = useFieldValue('hakuajat');
  const hakukohteenHakujat = hakuajatField?.hakuajat;
  const eriHakuaika = hakuajatField?.eriHakuaika;
  const hakukohteenHakuaikaMenossa = isHakukohteenHakuaikaMenossa(
    hakukohteenHakujat,
    eriHakuaika
  );
  const { data: hakukohdeInfo, isLoading } = useHakukohdeInfo(hakukohde?.oid);
  const arkistoituToPoistettuAllowed = isArkistoituToPoistettuAllowed(
    hakukohde,
    haku,
    hakukohteenHakuaikaMenossa,
    eriHakuaika,
    hakukohdeInfo,
    isLoading
  );

  const initiaTila = useInitalFieldValue('tila');
  const currentTila = useFieldValue('tila');
  useSetFieldValue(
    'tila',
    initiaTila,
    hakukohteenHakuaikaMenossa && currentTila === JULKAISUTILA.POISTETTU
  );

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
      {formMode === FormMode.CREATE && (
        <FormCollapse
          section="organisaatio"
          Component={OrganisaatioSectionCreate}
          header={t('yleiset.organisaatiovalinta')}
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
        koulutustyyppi={koulutustyyppi}
        Component={JarjestyspaikkaSection}
      />

      <FormCollapse
        section="tila"
        header={t('hakukohdelomake.hakukohteenTila')}
        Component={JulkaisutilaField}
        entity={hakukohde}
        arkistoituToPoistettuAllowed={arkistoituToPoistettuAllowed}
      />
    </FormCollapseGroup>
  );
};
