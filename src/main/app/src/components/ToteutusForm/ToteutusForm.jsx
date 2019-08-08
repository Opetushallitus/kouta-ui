import React, { useCallback } from 'react';
import get from 'lodash/get';

import FormCollapse from '../FormCollapse';
import KieliversiotFields from '../KieliversiotFields';
import OsaamisalatSection from './OsaamisalatSection';
import NimiSection from './NimiSection';
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
import KuvausSection from './KuvausSection';
import useTranslation from '../useTranslation';
import YhteyshenkilotSection from './YhteyshenkilotSection';
import isKorkeakouluKoulutustyyppi from '../../utils/isKorkeakouluKoulutustyyppi';
import isAmmatillinenKoulutustyyppi from '../../utils/isAmmatillinenKoulutustyyppi';
import { KOULUTUSTYYPPI } from '../../constants';
import useFieldValue from '../useFieldValue';
import useModal from '../useModal';

const PohjaFormCollapse = ({
  children,
  onContinue,
  onSelectBase,
  ...props
}) => {
  const tapa = useFieldValue('pohja.tapa');
  const valinta = useFieldValue('pohja.valinta');

  const onPohjaContinue = useCallback(() => {
    onContinue();
    onSelectBase({
      tapa,
      valinta: get(valinta, 'value'),
    });
  }, [onSelectBase, tapa, valinta, onContinue]);

  return (
    <FormCollapse onContinue={onPohjaContinue} {...props}>
      {children}
    </FormCollapse>
  );
};

const ToteutusForm = ({
  koulutusKoodiUri,
  organisaatioOid,
  steps = false,
  canSelectBase = true,
  scrollTarget,
  toteutus,
  onAttachHakukohde,
  koulutustyyppi = KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
  onSelectBase = () => {},
}) => {
  const isKorkeakoulu = isKorkeakouluKoulutustyyppi(koulutustyyppi);
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
      >
        {canSelectBase ? (
          <PohjaFormCollapse
            header={t('yleiset.pohjanValinta')}
            onSelectBase={onSelectBase}
            scrollOnActive={false}
            {...getTestIdProps('pohjaSection')}
          >
            <PohjaSection organisaatioOid={organisaatioOid} name="pohja" />
          </PohjaFormCollapse>
        ) : null}

        <FormCollapse
          header={t('yleiset.kieliversiot')}
          {...getTestIdProps('kieliversiotSection')}
        >
          <KieliversiotFields name="kieliversiot" />
        </FormCollapse>

        {isKorkeakoulu ? (
          <FormCollapse
            header={t('toteutuslomake.koulutuksenToteutuksenKuvaus')}
            languages={languages}
            {...getTestIdProps('kuvausSection')}
          >
            <KuvausSection name="kuvaus" />
          </FormCollapse>
        ) : null}

        {isKorkeakoulu ? (
          <FormCollapse
            header={t(
              'toteutuslomake.alemmanKorkeakoulututkinnonErikoistumisalanKuvaus',
            )}
            languages={languages}
            {...getTestIdProps('alempiOsaamisalatSection')}
          >
            <KorkeakouluOsaamisalatSection name="alemmanKorkeakoulututkinnonOsaamisalat" />
          </FormCollapse>
        ) : null}

        {isKorkeakoulu ? (
          <FormCollapse
            header={t(
              'toteutuslomake.ylemmanKorkeakoulututkinnonErikoistumisalanKuvaus',
            )}
            languages={languages}
            {...getTestIdProps('ylempiOsaamisalatSection')}
          >
            <KorkeakouluOsaamisalatSection name="ylemmanKorkeakoulututkinnonOsaamisalat" />
          </FormCollapse>
        ) : null}

        {isAmmatillinenKoulutustyyppi(koulutustyyppi) ? (
          <FormCollapse
            header={t('toteutuslomake.valitseOsaamisalat')}
            languages={languages}
            {...getTestIdProps('osaamisalatSection')}
          >
            <OsaamisalatSection
              name="osaamisalat"
              koulutusKoodiUri={koulutusKoodiUri}
            />
          </FormCollapse>
        ) : null}

        <FormCollapse
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
          header={t('toteutuslomake.koulutuksenNayttamiseenLiittyvatTiedot')}
          languages={languages}
          {...getTestIdProps('nayttamistiedotSection')}
        >
          <NayttamisTiedotSection name="nayttamistiedot" />
        </FormCollapse>

        <FormCollapse
          header={t('toteutuslomake.toteutuksenJarjestaja')}
          languages={languages}
          {...getTestIdProps('jarjestamispaikatSection')}
        >
          <JarjestamispaikatSection
            name="jarjestamispaikat"
            organisaatioOid={organisaatioOid}
          />
        </FormCollapse>

        <FormCollapse
          header={t('toteutuslomake.toteutuksenNimi')}
          languages={languages}
          {...getTestIdProps('nimiSection')}
        >
          <NimiSection name="nimi" />
        </FormCollapse>

        <FormCollapse
          header={t('toteutuslomake.koulutuksenYhteystiedot')}
          languages={languages}
          {...getTestIdProps('yhteystiedotSection')}
        >
          <YhteyshenkilotSection name="yhteyshenkilot" />
        </FormCollapse>

        {isFunction(onAttachHakukohde) ? (
          <FormCollapse
            header={t('toteutuslomake.toteutukseenLiitetytHakukohteet')}
            id="toteutukseen-liitetetyt-hakukohteet"
            clearable={false}
            actions={
              <Flex justifyCenter full>
                <Button onClick={open} type="button">
                  {t('yleiset.liitaHakukohde')}
                </Button>
              </Flex>
            }
          >
            <HakukohteetSection toteutus={toteutus} />
          </FormCollapse>
        ) : null}
      </FormCollapseGroup>
    </>
  );
};

export default ToteutusForm;
