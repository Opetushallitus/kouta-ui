import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';

import { FormButton } from '#/src/components/FormButton';
import FormCollapse from '#/src/components/FormCollapse';
import FormCollapseGroup from '#/src/components/FormCollapseGroup';
import { JulkaisutilaField } from '#/src/components/JulkaisutilaField';
import KieliversiotFields from '#/src/components/KieliversiotFields';
import { OrganisaatioSection } from '#/src/components/OrganisaatioSection';
import { OrganisaatioSectionCreate } from '#/src/components/OrganisaatioSectionCreate';
import PohjaFormCollapse from '#/src/components/PohjaFormCollapse';
import SoraKuvausSection from '#/src/components/SoraKuvausSection';
import TeemakuvaSection from '#/src/components/TeemakuvaSection';
import { Box } from '#/src/components/virkailija';
import {
  KOULUTUSTYYPPI,
  HAKULOMAKETYYPPI,
  TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT,
  FormMode,
  ENTITY,
  AMM_TUTKINTO_KOULUTUSKOODIURIT_WITHOUT_EPERUSTE,
} from '#/src/constants';
import { useFormMode } from '#/src/contexts/FormContext';
import { useFieldValue } from '#/src/hooks/form';
import useModal from '#/src/hooks/useModal';
import { KoulutusModel, ToteutusModel } from '#/src/types/domainTypes';
import { getTestIdProps } from '#/src/utils';
import { useFilteredHakukohteet } from '#/src/utils/hakukohde/searchHakukohteet';
import { isDIAkoulutus as isDIA } from '#/src/utils/isDIAkoulutus';
import { isEBkoulutus as isEB } from '#/src/utils/isEBkoulutus';
import { koodiUriWithoutVersion } from '#/src/utils/koodi/koodiUriWithoutVersion';
import { getToteutukset } from '#/src/utils/toteutus/getToteutukset';
import { isHakeutumisTaiIlmoittautumisosioVisible } from '#/src/utils/toteutus/toteutusVisibilities';

import { HakeutumisTaiIlmoittautumistapaSection } from './HakeutumisTaiIlmoittautumistapaSection/HakeutumisTaiIlmoittautumistapaSection';
import HakukohteetModal from './HakukohteetModal';
import { HakukohteetSection } from './HakukohteetSection';
import { JarjestamispaikatSection } from './JarjestamispaikatSection';
import { JarjestamisTiedotSection } from './JarjestamisTiedotSection';
import { LukiolinjatSection } from './LukiolinjatSection';
import { NayttamisTiedotSection } from './NayttamisTiedotSection';
import { OpintojaksojenLiittamisSection } from './OpintojaksojenLiittamisSection';
import { OsaamisalatSection } from './OsaamisalatSection';
import { OsaamismerkkienLiittamisSection } from './OsaamismerkkienLiittamisSection';
import {
  AikuistenperusopetusTiedotSection,
  AmmMuuTiedotSection,
  OpettajaTiedotSection,
  KkOpintojaksoTiedotSection,
  KkOpintokokonaisuusTiedotSection,
  LukioTiedotSection,
  TelmaTiedotSection,
  TutkinnonOsaTiedotSection,
  TutkintoonJohtavaTiedotSection,
  TuvaTiedotSection,
  EBTiedotSection,
  DIATiedotSection,
  VapaaSivistystyoMuuTiedotSection,
  VapaaSivistystyoOsaamismerkkiTiedotSection,
  VapaaSivistystyoOpistovuosiTiedotSection,
  ErikoistumiskoulutusTiedotSection,
  TaiteenperusopetusTiedotSection,
  MuuTiedotSection,
  OsaamisalaTiedotSection,
} from './TiedotSection';
import {
  OsaamismerkkiToteutuksenKuvausSection,
  ToteutuksenKuvausSection,
  ToteutuksenKuvausJaOsaamistavoitteetSection,
} from './ToteutuksenKuvausSection';
import { ToteutusjaksotSection } from './ToteutusjaksotSection';
import { YhteyshenkilotSection } from './YhteyshenkilotSection';

const { MUU } = HAKULOMAKETYYPPI;

type ToteutusFormProps = {
  koulutus: KoulutusModel;
  organisaatioOid: string;
  steps?: boolean;
  toteutus?: ToteutusModel;
  onAttachHakukohde?: (props: { hakuOid }) => void;
  koulutustyyppi?: KOULUTUSTYYPPI;
};

const ToteutusForm = ({
  koulutus,
  organisaatioOid,
  steps = false,
  toteutus,
  onAttachHakukohde,
  koulutustyyppi = KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
}: ToteutusFormProps) => {
  const { t } = useTranslation();
  const kieliversiot = useFieldValue('kieliversiot');
  const languages = kieliversiot || [];
  const { isOpen, open, close } = useModal();

  const hakeutumisTaiIlmoittautumistapa = useFieldValue(
    'hakeutumisTaiIlmoittautumistapa.hakeutumisTaiIlmoittautumistapa'
  );

  const hakukohteetKaytossaValittu = useFieldValue(
    'hakeutumisTaiIlmoittautumistapa.isHakukohteetKaytossa'
  );

  const hakukohteetKaytossa = isHakeutumisTaiIlmoittautumisosioVisible(
    koulutustyyppi
  )
    ? hakukohteetKaytossaValittu === true
    : true;

  const isEBkoulutus = isEB(koulutus?.koulutuksetKoodiUri, koulutustyyppi);
  const isDIAkoulutus = isDIA(koulutus?.koulutuksetKoodiUri, koulutustyyppi);

  const formMode = useFormMode();

  const { data } = useFilteredHakukohteet(
    { toteutusOid: toteutus?.oid },
    organisaatioOid
  );

  let hakukohdeAmount = '';
  if (data?.totalCount) {
    hakukohdeAmount = ' (' + data.totalCount + ')';
  }

  // jos toteutusta ei vielä tallennettu, totalcount on koko organisaation hakukohdemäärä ilman toteutusrajausta
  const hasHakukohdeAttached: boolean =
    toteutus?.oid && data?.totalCount ? Number(data?.totalCount) > 0 : false;

  const hasOsaamistavoitteetField =
    ![
      KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
      KOULUTUSTYYPPI.OSAAMISALA,
      KOULUTUSTYYPPI.TUTKINNON_OSA,
    ].includes(koulutustyyppi) ||
    koulutus?.koulutuksetKoodiUri?.some(koodiUri =>
      AMM_TUTKINTO_KOULUTUSKOODIURIT_WITHOUT_EPERUSTE.includes(
        koodiUriWithoutVersion(koodiUri)
      )
    );

  return (
    <>
      <HakukohteetModal
        open={isOpen}
        onClose={close}
        organisaatioOid={organisaatioOid}
        onSave={onAttachHakukohde}
      />
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
            entityType={ENTITY.TOTEUTUS}
            scrollOnActive={false}
            getCopyEntities={getToteutukset}
            infoText={t('toteutuslomake.pohjavalintaInfo')}
            createLabel={t('yleiset.luoUusiToteutus')}
            copyLabel={t('toteutuslomake.kopioiPohjaksi')}
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
          Component={KieliversiotFields}
        />

        <FormCollapse
          section="tiedot"
          header={t('toteutuslomake.toteutuksenTiedot')}
          languages={languages}
          Component={match(koulutustyyppi)
            .with(KOULUTUSTYYPPI.TUVA, () => TuvaTiedotSection)
            .with(KOULUTUSTYYPPI.TELMA, () => TelmaTiedotSection)
            .with(
              KOULUTUSTYYPPI.AIKUISTEN_PERUSOPETUS,
              () => AikuistenperusopetusTiedotSection
            )
            .with(
              KOULUTUSTYYPPI.TAITEEN_PERUSOPETUS,
              () => TaiteenperusopetusTiedotSection
            )
            .with(
              KOULUTUSTYYPPI.MUU_AMMATILLINEN_KOULUTUS,
              () => AmmMuuTiedotSection
            )
            .with(
              KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_OPISTOVUOSI,
              () => VapaaSivistystyoOpistovuosiTiedotSection
            )
            .with(
              KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_MUU,
              () => VapaaSivistystyoMuuTiedotSection
            )
            .with(
              KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_OSAAMISMERKKI,
              () => VapaaSivistystyoOsaamismerkkiTiedotSection
            )
            .with(KOULUTUSTYYPPI.TUTKINNON_OSA, () => TutkinnonOsaTiedotSection)
            .with(KOULUTUSTYYPPI.OSAAMISALA, () => OsaamisalaTiedotSection)
            .with(
              KOULUTUSTYYPPI.AMMATILLINEN_OPETTAJA_ERITYISOPETTAJA_JA_OPOKOULUTUS,
              KOULUTUSTYYPPI.OPETTAJIEN_PEDAGOGISET_OPINNOT,
              () => OpettajaTiedotSection
            )
            .with(
              KOULUTUSTYYPPI.KORKEAKOULUTUS_OPINTOJAKSO,
              () => KkOpintojaksoTiedotSection
            )
            .with(
              KOULUTUSTYYPPI.KORKEAKOULUTUS_OPINTOKOKONAISUUS,
              () => KkOpintokokonaisuusTiedotSection
            )
            .with(
              KOULUTUSTYYPPI.ERIKOISTUMISKOULUTUS,
              () => ErikoistumiskoulutusTiedotSection
            )
            .with(KOULUTUSTYYPPI.MUU, () => MuuTiedotSection)
            .when(
              kt =>
                kt === KOULUTUSTYYPPI.LUKIOKOULUTUS &&
                !isDIAkoulutus &&
                !isEBkoulutus,
              () => LukioTiedotSection
            )
            .when(
              () => isDIAkoulutus,
              () => DIATiedotSection
            )
            .when(
              () => isEBkoulutus,
              () => EBTiedotSection
            )
            .otherwise(() => TutkintoonJohtavaTiedotSection)}
          koulutustyyppi={koulutustyyppi}
          koulutus={koulutus}
        />

        <FormCollapse
          section="description"
          header={
            hasOsaamistavoitteetField
              ? t('toteutuslomake.toteutuksenKuvausJaOsaamistavoitteet')
              : t('toteutuslomake.toteutuksenKuvaus')
          }
          languages={languages}
          koulutus={koulutus}
          Component={match(koulutustyyppi)
            .with(
              KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_OSAAMISMERKKI,
              () => OsaamismerkkiToteutuksenKuvausSection
            )
            .when(
              () => hasOsaamistavoitteetField,
              () => ToteutuksenKuvausJaOsaamistavoitteetSection
            )
            .otherwise(() => ToteutuksenKuvausSection)}
        />
        {koulutustyyppi === KOULUTUSTYYPPI.KORKEAKOULUTUS_OPINTOKOKONAISUUS && (
          <FormCollapse
            section="opintojaksojenLiittaminen"
            header={t('toteutuslomake.opintojaksojenLiittaminen')}
            Component={OpintojaksojenLiittamisSection}
            organisaatioOid={organisaatioOid}
            entity={toteutus}
          />
        )}
        {[
          KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_MUU,
          KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_OPISTOVUOSI,
        ].includes(koulutustyyppi) && (
          <FormCollapse
            section="osaamismerkkienLiittaminen"
            header={t('toteutuslomake.osaamismerkkienLiittaminen')}
            Component={OsaamismerkkienLiittamisSection}
            organisaatioOid={organisaatioOid}
            entity={toteutus}
          />
        )}
        {koulutustyyppi === KOULUTUSTYYPPI.LUKIOKOULUTUS &&
          !isDIAkoulutus &&
          !isEBkoulutus && (
            <FormCollapse
              section="lukiolinjat"
              header={t('toteutuslomake.lukiolinjat')}
              languages={languages}
              Component={LukiolinjatSection}
            />
          )}
        {[
          KOULUTUSTYYPPI.AVOIN_YO,
          KOULUTUSTYYPPI.AVOIN_AMK,
          KOULUTUSTYYPPI.TAYDENNYSKOULUTUS,
        ].includes(koulutustyyppi) && (
          <FormCollapse
            section="toteutusjaksot"
            header={t('toteutuslomake.toteutukseenLiittyvatJaksot')}
            languages={languages}
            {...getTestIdProps('toteutusjaksotSection')}
            Component={ToteutusjaksotSection}
          />
        )}
        {TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT.includes(
          koulutustyyppi
        ) && (
          <FormCollapse
            section="osaamisalat"
            header={t('toteutuslomake.toteutuksenOsaamisalat')}
            languages={languages}
            Component={OsaamisalatSection}
            koulutus={koulutus}
            organisaatioOid={organisaatioOid}
          />
        )}
        <FormCollapse
          section="jarjestamistiedot"
          header={t('toteutuslomake.toteutuksenJarjestamistiedot')}
          languages={languages}
          Component={JarjestamisTiedotSection}
          koulutustyyppi={koulutustyyppi}
          koulutusKoodiurit={koulutus?.koulutuksetKoodiUri}
          toteutuksenMetadata={toteutus?.metadata}
        />
        <FormCollapse
          section="teemakuva"
          header={t('toteutuslomake.toteutuksenTeemakuva')}
          Component={TeemakuvaSection}
        />
        <FormCollapse
          section="nayttamistiedot"
          header={t('toteutuslomake.koulutuksenNayttamiseenLiittyvatTiedot')}
          Component={NayttamisTiedotSection}
          koulutustyyppi={koulutustyyppi}
          languages={languages}
        />
        <FormCollapse
          section="tarjoajat"
          header={t('toteutuslomake.toteutuksenJarjestaja')}
          Component={JarjestamispaikatSection}
          languages={languages}
          organisaatioOid={organisaatioOid}
          tarjoajat={toteutus?.tarjoajat}
        />
        {isHakeutumisTaiIlmoittautumisosioVisible(koulutustyyppi) && (
          <FormCollapse
            section="hakeutumisTaiIlmoittautumistapa"
            header={t('toteutuslomake.hakeutumisTaiIlmoittautumistapa')}
            Component={HakeutumisTaiIlmoittautumistapaSection}
            languages={languages}
            koulutustyyppi={koulutustyyppi}
            hasHakukohdeAttached={hasHakukohdeAttached}
            {...getTestIdProps('hakeutumisTaiIlmoittautumistapaSection')}
          />
        )}
        {[KOULUTUSTYYPPI.TUTKINNON_OSA, KOULUTUSTYYPPI.OSAAMISALA].includes(
          koulutustyyppi
        ) &&
          hakeutumisTaiIlmoittautumistapa === MUU && (
            <FormCollapse
              section="soraKuvaus"
              header={t('yleiset.soraKuvaus')}
              Component={SoraKuvausSection}
              organisaatioOid={organisaatioOid}
              languages={languages}
            />
          )}
        <FormCollapse
          section="yhteyshenkilot"
          header={t('toteutuslomake.koulutuksenYhteystiedot')}
          Component={YhteyshenkilotSection}
          languages={languages}
        />
        <FormCollapse
          section="tila"
          header={t('toteutuslomake.toteutuksenTila')}
          Component={JulkaisutilaField}
          entity={toteutus}
          {...getTestIdProps('tilaSection')}
        />
        {_.isFunction(onAttachHakukohde) && hakukohteetKaytossa && (
          <FormCollapse
            header={
              t('toteutuslomake.toteutukseenLiitetytHakukohteet') +
              hakukohdeAmount
            }
            id="toteutukseen-liitetetyt-hakukohteet"
            actions={
              <Box
                display="flex"
                justifyContent="center"
                width="100%"
                height="100%"
                flexBasis="100%"
              >
                <FormButton onClick={open} type="button">
                  {t('yleiset.liitaHakukohde')}
                </FormButton>
              </Box>
            }
            Component={HakukohteetSection}
            toteutus={toteutus}
            organisaatioOid={organisaatioOid}
            {...getTestIdProps('hakukohteetSection')}
          />
        )}
      </FormCollapseGroup>
    </>
  );
};

export default ToteutusForm;
