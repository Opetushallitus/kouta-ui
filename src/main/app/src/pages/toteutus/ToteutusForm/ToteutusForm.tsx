import React from 'react';
import { isFunction } from 'lodash';
import { useTranslation } from 'react-i18next';

import getToteutukset from '#/src/utils/toteutus/getToteutukset';
import FormCollapse from '#/src/components/FormCollapse';
import KieliversiotFields from '#/src/components/KieliversiotFields';
import OsaamisalatSection from './OsaamisalatSection';
import JarjestamispaikatSection from './JarjestamispaikatSection';
import JarjestamisTiedotSection from './JarjestamisTiedotSection';
import NayttamisTiedotSection from './NayttamisTiedotSection';
import FormCollapseGroup from '#/src/components/FormCollapseGroup';
import HakukohteetSection from './HakukohteetSection';
import { getTestIdProps } from '#/src/utils';
import HakukohteetModal from './HakukohteetModal';
import Flex from '#/src/components/Flex';
import Button from '#/src/components/Button';
import KorkeakouluOsaamisalatSection from './KorkeakouluOsaamisalatSection';
import YhteyshenkilotSection from './YhteyshenkilotSection';
import { KOULUTUSTYYPPI } from '#/src/constants';
import { useFieldValue } from '#/src/hooks/form';
import useModal from '#/src/hooks/useModal';
import LukiolinjatSection from './LukiolinjatSection';
import JulkaisutilaField from '#/src/components/JulkaisutilaField';
import TiedotSection from './TiedotSection';
import ToteutusjaksotSection from './ToteutusjaksotSection';
import TutkinnonOsatSection from './TutkinnonOsatSection';
import TeemakuvaSection from '#/src/components/TeemakuvaSection';
import PohjaFormCollapse from '#/src/components/PohjaFormCollapse';
import HakeutumisTaiIlmoittautumistapaSection from './HakeutumisTaiIlmoittautumistapaSection';

const ToteutusForm = ({
  koulutus,
  organisaatioOid,
  steps = false,
  canSelectBase = true,
  toteutus = undefined,
  onAttachHakukohde = undefined,
  koulutustyyppi = KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
  showArkistoituTilaOption = true,
  onSelectBase = undefined,
}) => {
  const { t } = useTranslation();
  const kieliversiot = useFieldValue('kieliversiot');
  const languages = kieliversiot || [];
  const { isOpen, open, close } = useModal();

  return (
    <>
      <HakukohteetModal
        open={isOpen}
        onClose={close}
        organisaatioOid={organisaatioOid}
        onSave={onAttachHakukohde}
      />
      <FormCollapseGroup enabled={steps} defaultOpen={!steps} configured>
        {canSelectBase && (
          <PohjaFormCollapse
            onSelectBase={onSelectBase}
            scrollOnActive={false}
            getCopyEntities={getToteutukset}
            createLabel={t('yleiset.luoUusi', {
              entity: t('yleiset.toteutus'),
            })}
            copyLabel={t('yleiset.kopioiPohjaksi', {
              entity: t('yleiset.toteutus'),
            })}
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
          Component={TiedotSection}
        />

        <FormCollapse
          section="lukiolinjat"
          header={t('toteutuslomake.lukionlinja')}
          languages={languages}
          Component={LukiolinjatSection}
        />

        <FormCollapse
          section="tutkinnonOsat"
          header={t('toteutuslomake.koulutukseenLiittyvatTutkinnonOsat')}
          Component={TutkinnonOsatSection}
        />

        <FormCollapse
          section="toteutusjaksot"
          header={t('toteutuslomake.toteutukseenLiittyvatJaksot')}
          languages={languages}
          {...getTestIdProps('toteutusjaksotSection')}
          Component={ToteutusjaksotSection}
        />

        <FormCollapse
          section="alemmanKorkeakoulututkinnonOsaamisalat"
          header={t(
            'toteutuslomake.alemmanKorkeakoulututkinnonErikoistumisalanKuvaus'
          )}
          Component={KorkeakouluOsaamisalatSection}
          languages={languages}
        />

        <FormCollapse
          section="ylemmanKorkeakoulututkinnonOsaamisalat"
          header={t(
            'toteutuslomake.ylemmanKorkeakoulututkinnonErikoistumisalanKuvaus'
          )}
          Component={KorkeakouluOsaamisalatSection}
          languages={languages}
        />

        <FormCollapse
          section="osaamisalat"
          header={t('toteutuslomake.toteutuksenOsaamisalat')}
          languages={languages}
          Component={OsaamisalatSection}
          koulutus={koulutus}
          organisaatioOid={organisaatioOid}
        />

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
          languages={languages}
        />

        <FormCollapse
          section="tarjoajat"
          header={t('toteutuslomake.toteutuksenJarjestaja')}
          Component={JarjestamispaikatSection}
          languages={languages}
          organisaatioOid={organisaatioOid}
        />

        <FormCollapse
          section="hakeutumisTaiIlmoittautumistapa"
          header={t('toteutuslomake.hakeutumisTaiIlmoittautumistapa')}
          Component={HakeutumisTaiIlmoittautumistapaSection}
          languages={languages}
        />

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

        {isFunction(onAttachHakukohde) ? (
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
          />
        ) : null}
      </FormCollapseGroup>
    </>
  );
};

export default ToteutusForm;
