import React, { useCallback } from 'react';
import get from 'lodash/get';

import TypeSection from './TypeSection';
import BaseSelectionSection from './BaseSelectionSection';
import TiedotSection from './TiedotSection/TiedotSection';
import KuvausSection from './KuvausSection';
import JarjestajaSection from './JarjestajaSection';
import FormCollapseGroup from '../FormCollapseGroup';
import FormCollapse from '../FormCollapse';
import KieliversiotFields from '../KieliversiotFields';
import ToteutuksetSection from './ToteutuksetSection';
import Button from '../Button';
import { isFunction, getTestIdProps } from '../../utils';
import LisatiedotSection from './LisatiedotSection';
import Flex from '../Flex';
import NakyvyysSection from './NakyvyysSection';
import useTranslation from '../useTranslation';
import useFieldValue from '../useFieldValue';
import JulkaisutilaSection from './JulkaisutilaSection';
import isOphOrganisaatio from "../../utils/isOphOrganisaatio";

const PohjaFormCollapse = ({
  children,
  onSelectBase,
  onContinue,
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

const KoulutusForm = ({
  organisaatioOid,
  steps = false,
  createNewKoulutus = false,
  koulutus: koulutusProp = null,
  johtaaTutkintoon = true,
  onAttachToteutus,
  onSelectBase,
}) => {
  const { t } = useTranslation();

  const koulutustyyppi = useFieldValue('koulutustyyppi');
  const kieliversiotValue = useFieldValue('kieliversiot');
  const koulutuskoodi = useFieldValue('information.koulutus');
  const languageTabs = kieliversiotValue || [];
  const disableTarjoajaSection = isOphOrganisaatio(organisaatioOid) && createNewKoulutus;
  const disableTarjoajaHierarkia = isOphOrganisaatio(organisaatioOid) && !createNewKoulutus;

  return (
    <FormCollapseGroup enabled={steps} defaultOpen={!steps} configured>
      {createNewKoulutus ? (
        <FormCollapse
          section="koulutustyyppi"
          header={t('yleiset.koulutustyyppi')}
          scrollOnActive={false}
          {...getTestIdProps('tyyppiSection')}
        >
          <TypeSection
            name="koulutustyyppi"
            johtaaTutkintoon={johtaaTutkintoon}
          />
        </FormCollapse>
      ) : null}

      {isFunction(onSelectBase) ? (
        <PohjaFormCollapse
          section="pohja"
          header={t('yleiset.pohjanValinta')}
          onSelectBase={onSelectBase}
          {...getTestIdProps('pohjaSection')}
        >
          <BaseSelectionSection
            name="pohja"
            organisaatioOid={organisaatioOid}
          />
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
        header={t('koulutuslomake.koulutuksenTiedot')}
        languages={languageTabs}
        {...getTestIdProps('tiedotSection')}
      >
        <TiedotSection
          koulutustyyppi={koulutustyyppi}
          koulutuskoodi={koulutuskoodi}
          name="information"
        />
      </FormCollapse>

      <FormCollapse
        section="kuvaus"
        header={t('koulutuslomake.koulutuksenKuvaus')}
        languages={languageTabs}
        {...getTestIdProps('kuvausSection')}
      >
        <KuvausSection
          koulutustyyppi={koulutustyyppi}
          koulutuskoodi={koulutuskoodi}
          name="description"
        />
      </FormCollapse>

      <FormCollapse
        section="lisatiedot"
        header={t('koulutuslomake.koulutuksenLisatiedot')}
        languages={languageTabs}
        {...getTestIdProps('lisatiedotSection')}
      >
        <LisatiedotSection name="lisatiedot" />
      </FormCollapse>

      {!disableTarjoajaSection ? (
        <FormCollapse
          section="jarjestyspaikka"
          header={t('koulutuslomake.koulutuksenJarjestaja')}
          {...getTestIdProps('jarjestajaSection')}
        >
          <JarjestajaSection
            organisaatioOid={organisaatioOid}
            koulutus={koulutusProp}
            name="tarjoajat"
            disableTarjoajaHierarkia={disableTarjoajaHierarkia}
          />
        </FormCollapse>) : null}

      <FormCollapse
        section="julkisuus"
        header="Koulutuksen näkyminen muille koulutustoimijoille"
        {...getTestIdProps('nakyvyysSection')}
      >
        <NakyvyysSection name="julkinen" />
      </FormCollapse>

      <FormCollapse
        section="julkaisutila"
        header={t('koulutuslomake.koulutuksenTila')}
        {...getTestIdProps('tilaSection')}
      >
        <JulkaisutilaSection
          name="tila"
          showArkistoitu={!createNewKoulutus}
        />
      </FormCollapse>

      {isFunction(onAttachToteutus) ? (
        <FormCollapse
          header={t('koulutuslomake.koulutukseenLiitetytToteutukset')}
          id="koulutukseen-liitetetyt-toteutukset"
          actions={
            <Flex justifyCenter>
              <Button color="primary" onClick={onAttachToteutus} type="button">
                {t('koulutuslomake.liitaToteutus')}
              </Button>
            </Flex>
          }
        >
          <ToteutuksetSection
            koulutus={koulutusProp}
            organisaatioOid={organisaatioOid}
          />
        </FormCollapse>
      ) : null}
    </FormCollapseGroup>
  );
};

export default KoulutusForm;
