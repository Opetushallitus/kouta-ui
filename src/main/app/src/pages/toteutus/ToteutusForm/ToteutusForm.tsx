import React from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import Button from '#/src/components/Button';
import { Flex } from '#/src/components/Flex';
import FormCollapse from '#/src/components/FormCollapse';
import FormCollapseGroup from '#/src/components/FormCollapseGroup';
import JulkaisutilaField from '#/src/components/JulkaisutilaField';
import KieliversiotFields from '#/src/components/KieliversiotFields';
import PohjaFormCollapse from '#/src/components/PohjaFormCollapse';
import SoraKuvausSection from '#/src/components/SoraKuvausSection';
import TeemakuvaSection from '#/src/components/TeemakuvaSection';
import {
  KOULUTUSTYYPPI,
  HAKULOMAKETYYPPI,
  TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT,
} from '#/src/constants';
import { useFieldValue } from '#/src/hooks/form';
import useModal from '#/src/hooks/useModal';
import { KoulutusModel } from '#/src/types/koulutusTypes';
import { ToteutusModel } from '#/src/types/toteutusTypes';
import { getTestIdProps } from '#/src/utils';
import { getToteutukset } from '#/src/utils/toteutus/getToteutukset';

import HakeutumisTaiIlmoittautumistapaSection from './HakeutumisTaiIlmoittautumistapaSection';
import HakukohteetModal from './HakukohteetModal';
import { HakukohteetSection } from './HakukohteetSection';
import { JarjestamispaikatSection } from './JarjestamispaikatSection';
import { JarjestamisTiedotSection } from './JarjestamisTiedotSection';
import { LukiolinjatSection } from './LukiolinjatSection';
import { NayttamisTiedotSection } from './NayttamisTiedotSection';
import { OsaamisalatSection } from './OsaamisalatSection';
import { TiedotSection } from './TiedotSection';
import { ToteutusjaksotSection } from './ToteutusjaksotSection';
import { YhteyshenkilotSection } from './YhteyshenkilotSection';

const { ATARU, MUU } = HAKULOMAKETYYPPI;

type ToteutusFormProps = {
  koulutus: KoulutusModel;
  organisaatioOid: string;
  steps?: boolean;
  canSelectBase?: boolean;
  toteutus?: ToteutusModel;
  onAttachHakukohde?: ({ hakuOid }) => void;
  koulutustyyppi?: KOULUTUSTYYPPI;
  showArkistoituTilaOption?: boolean;
  onSelectBase?: (pohjavalinta: PohjaValinta) => void;
};

const ToteutusForm = ({
  koulutus,
  organisaatioOid,
  steps = false,
  canSelectBase = true,
  toteutus,
  onAttachHakukohde,
  koulutustyyppi = KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
  showArkistoituTilaOption = true,
  onSelectBase,
}: ToteutusFormProps) => {
  const { t } = useTranslation();
  const kieliversiot = useFieldValue('kieliversiot');
  const languages = kieliversiot || [];
  const { isOpen, open, close } = useModal();

  const hakeutumisTaiIlmoittautumistapa = useFieldValue(
    'hakeutumisTaiIlmoittautumistapa.hakeutumisTaiIlmoittautumistapa'
  );

  const kaytetaanHakemuspalvelua = [
    KOULUTUSTYYPPI.TUTKINNON_OSA,
    KOULUTUSTYYPPI.OSAAMISALA,
  ].includes(koulutustyyppi)
    ? hakeutumisTaiIlmoittautumistapa === ATARU
    : true;

  return (
    <>
      <HakukohteetModal
        open={isOpen}
        onClose={close}
        organisaatioOid={organisaatioOid}
        onSave={onAttachHakukohde}
      />
      <FormCollapseGroup enabled={steps} defaultOpen={!steps}>
        {canSelectBase && (
          <PohjaFormCollapse
            onSelectBase={onSelectBase}
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
        {koulutustyyppi !== KOULUTUSTYYPPI.LUKIOKOULUTUS && (
          <FormCollapse
            section="tiedot"
            header={t('toteutuslomake.toteutuksenTiedot')}
            languages={languages}
            Component={TiedotSection}
            koulutustyyppi={koulutustyyppi}
          />
        )}
        {koulutustyyppi === KOULUTUSTYYPPI.LUKIOKOULUTUS && (
          <FormCollapse
            section="lukiolinjat"
            header={t('toteutuslomake.lukiolinja')}
            languages={languages}
            Component={LukiolinjatSection}
          />
        )}
        {[
          KOULUTUSTYYPPI.AVOIN_YO,
          KOULUTUSTYYPPI.AVOIN_AMK,
          KOULUTUSTYYPPI.ERIKOISTUMISKOULUTUS,
          KOULUTUSTYYPPI.TAYDENNYS_KOULUTUS,
        ].includes(koulutustyyppi) && (
          <FormCollapse
            section="toteutusjaksot"
            header={t('toteutuslomake.toteutukseenLiittyvatJaksot')}
            languages={languages}
            {...getTestIdProps('toteutusjaksotSection')}
            Component={ToteutusjaksotSection}
          />
        )}
        {/* 
        <FormCollapse
          section="alemmanKorkeakoulututkinnonOsaamisalat"
          header={t(
            'toteutuslomake.alemmanKorkeakoulututkinnonErikoistumisalanKuvaus'
          )}
          Component={KorkeakouluOsaamisalatFields}
          languages={languages}
        />

        <FormCollapse
          section="ylemmanKorkeakoulututkinnonOsaamisalat"
          header={t(
            'toteutuslomake.ylemmanKorkeakoulututkinnonErikoistumisalanKuvaus'
          )}
          Component={KorkeakouluOsaamisalatFields}
          languages={languages}
        />
        */}
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
        />
        {[KOULUTUSTYYPPI.TUTKINNON_OSA, KOULUTUSTYYPPI.OSAAMISALA].includes(
          koulutustyyppi
        ) && (
          <>
            <FormCollapse
              section="hakeutumisTaiIlmoittautumistapa"
              header={t('toteutuslomake.hakeutumisTaiIlmoittautumistapa')}
              Component={HakeutumisTaiIlmoittautumistapaSection}
              languages={languages}
            />
            {hakeutumisTaiIlmoittautumistapa === MUU && (
              <FormCollapse
                section="soraKuvaus"
                header={t('yleiset.soraKuvaus')}
                Component={SoraKuvausSection}
                organisaatioOid={organisaatioOid}
                languages={languages}
              />
            )}
          </>
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
          {...getTestIdProps('tilaSection')}
          showArkistoitu={showArkistoituTilaOption}
        />
        {_fp.isFunction(onAttachHakukohde) && kaytetaanHakemuspalvelua ? (
          <FormCollapse
            header={t('toteutuslomake.toteutukseenLiitetytHakukohteet')}
            id="toteutukseen-liitetetyt-hakukohteet"
            actions={
              <Flex justifyCenter full>
                <Button onClick={open} type="button">
                  {t('yleiset.liitaHakukohde')}
                </Button>
              </Flex>
            }
            Component={HakukohteetSection}
            toteutus={toteutus}
            organisaatioOid={organisaatioOid}
            {...getTestIdProps('hakukohteetSection')}
          />
        ) : null}
      </FormCollapseGroup>
    </>
  );
};

export default ToteutusForm;
