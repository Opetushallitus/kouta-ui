import React from 'react';
import FormCollapse from '../FormCollapse';
import KieliversiotFields from '../KieliversiotFields';
import OsaamisalatSection from './OsaamisalatSection';
import PohjaSection from './PohjaSection';
import JarjestamispaikatSection from './JarjestamispaikatSection';
import JarjestamisTiedotSection from './JarjestamisTiedotSection';
import NayttamisTiedotSection from './NayttamisTiedotSection';
import FormCollapseGroup from '../FormCollapseGroup';
import HakukohteetSection from './HakukohteetSection';
import { isFunction, getTestIdProps } from '../../utils';
import HakukohteetModal from './HakukohteetModal';
import Flex from '../Flex';
import Button from '../Button';
import KorkeakouluOsaamisalatSection from './KorkeakouluOsaamisalatSection';
import useTranslation from '../useTranslation';
import YhteyshenkilotSection from './YhteyshenkilotSection';
import { KOULUTUSTYYPPI } from '../../constants';
import useFieldValue from '../useFieldValue';
import useModal from '../useModal';
import LukiolinjatSection from './LukiolinjatSection';
import JulkaisutilaSection from './JulkaisutilaSection';
import TiedotSection from './TiedotSection';
import ToteutusjaksotSection from './ToteutusjaksotSection';
import TutkinnonOsatSection from './TutkinnonOsatSection';
import TeemakuvaSection from '../TeemakuvaSection';
import PohjaFormCollapse from '../PohjaFormCollapse';

const ToteutusForm = ({
  koulutus,
  organisaatioOid,
  steps = false,
  canSelectBase = true,
  scrollTarget,
  toteutus,
  onAttachHakukohde,
  koulutustyyppi = KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
  showArkistoituTilaOption = true,
  onSelectBase = () => {},
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
      <FormCollapseGroup
        enabled={steps}
        scrollTarget={scrollTarget}
        defaultOpen={!steps}
        configured
      >
        {canSelectBase ? (
          <PohjaFormCollapse
            section="pohja"
            header={t('yleiset.pohjanValinta')}
            onSelectBase={onSelectBase}
            scrollOnActive={false}
            {...getTestIdProps('pohjaSection')}
          >
            <PohjaSection organisaatioOid={organisaatioOid} name="pohja" />
          </PohjaFormCollapse>
        ) : null}

        <FormCollapse
          section="kieliversiot"
          header={t('yleiset.kieliversiot')}
          {...getTestIdProps('kieliversiotSection')}
        >
          <KieliversiotFields name="kieliversiot" />
        </FormCollapse>

        <FormCollapse
          section="tiedot"
          header={t('toteutuslomake.toteutuksenTiedot')}
          languages={languages}
          {...getTestIdProps('tiedotSection')}
        >
          <TiedotSection name="tiedot" />
        </FormCollapse>

        <FormCollapse
          section="lukiolinjat"
          header={t('toteutuslomake.lukionlinja')}
          languages={languages}
          {...getTestIdProps('lukiolinjatSection')}
        >
          <LukiolinjatSection name="lukiolinjat" />
        </FormCollapse>

        <FormCollapse
          section="tutkinnonOsat"
          header={t('toteutuslomake.koulutukseenLiittyvatTutkinnonOsat')}
          {...getTestIdProps('tutkinnonOsatSection')}
        >
          <TutkinnonOsatSection name="tutkinnonOsat" />
        </FormCollapse>

        <FormCollapse
          section="toteutusjaksot"
          header={t('toteutuslomake.toteutukseenLiittyvatJaksot')}
          languages={languages}
          {...getTestIdProps('toteutusjaksotSection')}
        >
          <ToteutusjaksotSection name="toteutusjaksot" />
        </FormCollapse>

        <FormCollapse
          section="osaamisalatAlempitutkinto"
          header={t(
            'toteutuslomake.alemmanKorkeakoulututkinnonErikoistumisalanKuvaus',
          )}
          languages={languages}
          {...getTestIdProps('alempiOsaamisalatSection')}
        >
          <KorkeakouluOsaamisalatSection name="alemmanKorkeakoulututkinnonOsaamisalat" />
        </FormCollapse>

        <FormCollapse
          section="osaamisalatYlempitutkinto"
          header={t(
            'toteutuslomake.ylemmanKorkeakoulututkinnonErikoistumisalanKuvaus',
          )}
          languages={languages}
          {...getTestIdProps('ylempiOsaamisalatSection')}
        >
          <KorkeakouluOsaamisalatSection name="ylemmanKorkeakoulututkinnonOsaamisalat" />
        </FormCollapse>

        <FormCollapse
          section="osaamisalaTarkenteet"
          header={t('toteutuslomake.valitseOsaamisalat')}
          languages={languages}
          {...getTestIdProps('osaamisalatSection')}
        >
          <OsaamisalatSection
            name="osaamisalat"
            koulutus={koulutus}
            organisaatioOid={organisaatioOid}
          />
        </FormCollapse>

        <FormCollapse
          section="jarjestamistiedot"
          header={t('toteutuslomake.toteutuksenJarjestamistiedot')}
          languages={languages}
          {...getTestIdProps('jarjestamistiedotSection')}
        >
          <JarjestamisTiedotSection
            name="jarjestamistiedot"
            koulutustyyppi={koulutustyyppi}
          />
        </FormCollapse>

        <FormCollapse
          section="teemakuva"
          header={t('toteutuslomake.toteutuksenTeemakuva')}
          {...getTestIdProps('teemakuvaSection')}
        >
          <TeemakuvaSection name="teemakuva" />
        </FormCollapse>

        <FormCollapse
          section="nayttamistiedot"
          header={t('toteutuslomake.koulutuksenNayttamiseenLiittyvatTiedot')}
          languages={languages}
          {...getTestIdProps('nayttamistiedotSection')}
        >
          <NayttamisTiedotSection name="nayttamistiedot" />
        </FormCollapse>

        <FormCollapse
          section="jarjestamispaikat"
          header={t('toteutuslomake.toteutuksenJarjestaja')}
          languages={languages}
          {...getTestIdProps('jarjestamispaikatSection')}
        >
          <JarjestamispaikatSection
            name="tarjoajat"
            organisaatioOid={organisaatioOid}
          />
        </FormCollapse>

        <FormCollapse
          section="yhteystiedot"
          header={t('toteutuslomake.koulutuksenYhteystiedot')}
          languages={languages}
          {...getTestIdProps('yhteystiedotSection')}
        >
          <YhteyshenkilotSection name="yhteyshenkilot" />
        </FormCollapse>

        <FormCollapse
          section="julkaisutila"
          header={t('toteutuslomake.toteutuksenTila')}
          {...getTestIdProps('tilaSection')}
        >
          <JulkaisutilaSection
            name="tila"
            showArkistoitu={showArkistoituTilaOption}
          />
        </FormCollapse>

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
          >
            <HakukohteetSection
              toteutus={toteutus}
              organisaatioOid={organisaatioOid}
            />
          </FormCollapse>
        ) : null}
      </FormCollapseGroup>
    </>
  );
};

export default ToteutusForm;
