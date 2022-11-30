import React from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import Button from '#/src/components/Button';
import FormCollapse from '#/src/components/FormCollapse';
import FormCollapseGroup from '#/src/components/FormCollapseGroup';
import { JulkaisutilaField } from '#/src/components/JulkaisutilaField';
import KieliversiotFields from '#/src/components/KieliversiotFields';
import { OrganisaatioSection } from '#/src/components/OrganisaatioSection';
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
} from '#/src/constants';
import { useFormMode } from '#/src/contexts/FormContext';
import { useFieldValue } from '#/src/hooks/form';
import useModal from '#/src/hooks/useModal';
import { KoulutusModel } from '#/src/types/koulutusTypes';
import { ToteutusModel } from '#/src/types/toteutusTypes';
import { getTestIdProps, isIn, otherwise } from '#/src/utils';
import { useFilteredHakukohteet } from '#/src/utils/hakukohde/searchHakukohteet';
import { isDIAkoulutus as isDIA } from '#/src/utils/isDIAkoulutus';
import { isEBkoulutus as isEB } from '#/src/utils/isEBkoulutus';
import { getToteutukset } from '#/src/utils/toteutus/getToteutukset';

import HakeutumisTaiIlmoittautumistapaSection from './HakeutumisTaiIlmoittautumistapaSection';
import HakukohteetModal from './HakukohteetModal';
import { HakukohteetSection } from './HakukohteetSection';
import { JarjestamispaikatSection } from './JarjestamispaikatSection';
import { JarjestamisTiedotSection } from './JarjestamisTiedotSection';
import { LukiolinjatSection } from './LukiolinjatSection';
import { NayttamisTiedotSection } from './NayttamisTiedotSection';
import { OpintojaksojenLiittamisSection } from './OpintojaksojenLiittamisSection';
import { OsaamisalatSection } from './OsaamisalatSection';
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
  VapaaSivistystyoOpistovuosiTiedotSection,
  ErikoistumiskoulutusTiedotSection,
} from './TiedotSection';
import { ToteutuksenKuvausSection } from './ToteutuksenKuvausSection';
import { ToteutusjaksotSection } from './ToteutusjaksotSection';
import { YhteyshenkilotSection } from './YhteyshenkilotSection';

const { ATARU, MUU } = HAKULOMAKETYYPPI;

const KOULUTUSTYYPIT_WITH_HAKEUTUMIS_TAI_ILMOITTAUTUMISTAPA = [
  KOULUTUSTYYPPI.TUTKINNON_OSA,
  KOULUTUSTYYPPI.OSAAMISALA,
  KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_MUU,
  KOULUTUSTYYPPI.MUU_AMMATILLINEN_KOULUTUS,
  KOULUTUSTYYPPI.AIKUISTEN_PERUSOPETUS,
  KOULUTUSTYYPPI.KORKEAKOULUTUS_OPINTOJAKSO,
  KOULUTUSTYYPPI.KORKEAKOULUTUS_OPINTOKOKONAISUUS,
  KOULUTUSTYYPPI.ERIKOISTUMISKOULUTUS,
];

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

  const kaytetaanHakemuspalvelua =
    KOULUTUSTYYPIT_WITH_HAKEUTUMIS_TAI_ILMOITTAUTUMISTAPA.includes(
      koulutustyyppi
    )
      ? hakeutumisTaiIlmoittautumistapa === ATARU
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
        <FormCollapse
          section="kieliversiot"
          header={t('yleiset.kieliversiot')}
          Component={KieliversiotFields}
        />

        <FormCollapse
          section="tiedot"
          header={t('toteutuslomake.toteutuksenTiedot')}
          languages={languages}
          Component={_fp.cond([
            [_fp.isEqual(KOULUTUSTYYPPI.TUVA), () => TuvaTiedotSection],
            [_fp.isEqual(KOULUTUSTYYPPI.TELMA), () => TelmaTiedotSection],
            [
              _fp.isEqual(KOULUTUSTYYPPI.AIKUISTEN_PERUSOPETUS),
              () => AikuistenperusopetusTiedotSection,
            ],
            [
              _fp.isEqual(KOULUTUSTYYPPI.MUU_AMMATILLINEN_KOULUTUS),
              () => AmmMuuTiedotSection,
            ],
            [
              _fp.isEqual(KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_OPISTOVUOSI),
              () => VapaaSivistystyoOpistovuosiTiedotSection,
            ],
            [
              _fp.isEqual(KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_MUU),
              () => VapaaSivistystyoMuuTiedotSection,
            ],
            [
              isIn([KOULUTUSTYYPPI.TUTKINNON_OSA, KOULUTUSTYYPPI.OSAAMISALA]),
              () => TutkinnonOsaTiedotSection,
            ],
            [
              isIn([
                KOULUTUSTYYPPI.AMMATILLINEN_OPETTAJA_ERITYISOPETTAJA_JA_OPOKOULUTUS,
                KOULUTUSTYYPPI.OPETTAJIEN_PEDAGOGISET_OPINNOT,
              ]),
              () => OpettajaTiedotSection,
            ],
            [
              _fp.isEqual(KOULUTUSTYYPPI.KORKEAKOULUTUS_OPINTOJAKSO),
              () => KkOpintojaksoTiedotSection,
            ],
            [
              _fp.isEqual(KOULUTUSTYYPPI.KORKEAKOULUTUS_OPINTOKOKONAISUUS),
              () => KkOpintokokonaisuusTiedotSection,
            ],
            [
              _fp.isEqual(KOULUTUSTYYPPI.ERIKOISTUMISKOULUTUS),
              () => ErikoistumiskoulutusTiedotSection,
            ],
            [
              tyyppi =>
                _fp.isEqual(KOULUTUSTYYPPI.LUKIOKOULUTUS, tyyppi) &&
                !isDIAkoulutus &&
                !isEBkoulutus,
              () => LukioTiedotSection,
            ],
            [_fp.constant(isDIAkoulutus), () => DIATiedotSection],
            [_fp.constant(isEBkoulutus), () => EBTiedotSection],
            [otherwise, () => TutkintoonJohtavaTiedotSection],
          ])(koulutustyyppi)}
          koulutustyyppi={koulutustyyppi}
          koulutus={koulutus}
        />

        <FormCollapse
          section="kuvaus"
          header={t('toteutuslomake.toteutuksenKuvaus')}
          languages={languages}
          Component={ToteutuksenKuvausSection}
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
          KOULUTUSTYYPPI.ERIKOISTUMISKOULUTUS,
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
        {KOULUTUSTYYPIT_WITH_HAKEUTUMIS_TAI_ILMOITTAUTUMISTAPA.includes(
          koulutustyyppi
        ) && (
          <FormCollapse
            section="hakeutumisTaiIlmoittautumistapa"
            header={t('toteutuslomake.hakeutumisTaiIlmoittautumistapa')}
            Component={HakeutumisTaiIlmoittautumistapaSection}
            languages={languages}
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
        {_fp.isFunction(onAttachHakukohde) && kaytetaanHakemuspalvelua && (
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
                <Button onClick={open} type="button">
                  {t('yleiset.liitaHakukohde')}
                </Button>
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
