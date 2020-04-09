import React from 'react';

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
import { useTranslation } from 'react-i18next';
import useFieldValue from '../useFieldValue';
import JulkaisutilaSection from './JulkaisutilaSection';
import isOphOrganisaatio from '../../utils/isOphOrganisaatio';
import TeemakuvaSection from '../TeemakuvaSection';
import PohjaFormCollapse from '../PohjaFormCollapse';
import first from 'lodash/first';
import {
  isSameKoulutustyyppiWithOrganisaatio,
  useOrganisaatio,
} from '../useOrganisaatio';
import useOrganisaatioHierarkia from '../useOrganisaatioHierarkia';

const isInHierarkia = org => hierarkia =>
  hierarkia.organisaatioOid === org.organisaatioOid ||
  first(hierarkia.children.filter(isInHierarkia(org)));

const KoulutusForm = ({
  organisaatioOid,
  koulutusOrganisaatioOid,
  steps = false,
  isNewKoulutus = false,
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
  const isNewOphKoulutus = isOphOrganisaatio(organisaatioOid) && isNewKoulutus;
  const isExistingOphKoulutus =
    isOphOrganisaatio(organisaatioOid) && !isNewKoulutus;

  const { organisaatio } = useOrganisaatio(organisaatioOid);
  const { hierarkia = [] } = useOrganisaatioHierarkia(koulutusOrganisaatioOid);

  const onlyTarjoajaRights =
    !isNewKoulutus &&
    organisaatio &&
    hierarkia &&
    !isOphOrganisaatio(organisaatioOid) &&
    !isInHierarkia(organisaatio)(hierarkia) &&
    isSameKoulutustyyppiWithOrganisaatio(organisaatio, hierarkia)
      ? 'disabled'
      : null;

  return (
    <FormCollapseGroup enabled={steps} defaultOpen={!steps} configured>
      {isNewKoulutus ? (
        <FormCollapse
          section="koulutustyyppi"
          header={t('yleiset.koulutustyyppi')}
          scrollOnActive={false}
          {...getTestIdProps('tyyppiSection')}
        >
          <TypeSection
            disabled={onlyTarjoajaRights}
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
            disabled={onlyTarjoajaRights}
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
        <KieliversiotFields disabled={onlyTarjoajaRights} name="kieliversiot" />
      </FormCollapse>

      <FormCollapse
        section="tiedot"
        header={t('koulutuslomake.koulutuksenTiedot')}
        languages={languageTabs}
        {...getTestIdProps('tiedotSection')}
      >
        <TiedotSection
          disabled={onlyTarjoajaRights}
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
          disabled={onlyTarjoajaRights}
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
        <LisatiedotSection disabled={onlyTarjoajaRights} name="lisatiedot" />
      </FormCollapse>

      <FormCollapse
        section="teemakuva"
        header={t('koulutuslomake.koulutuksenTeemakuva')}
        {...getTestIdProps('teemakuvaSection')}
      >
        <TeemakuvaSection disabled={onlyTarjoajaRights} name="teemakuva" />
      </FormCollapse>

      {!isNewOphKoulutus ? (
        <FormCollapse
          section="jarjestyspaikka"
          header={t('koulutuslomake.koulutuksenJarjestaja')}
          {...getTestIdProps('jarjestajaSection')}
        >
          <JarjestajaSection
            organisaatioOid={organisaatioOid}
            koulutus={koulutusProp}
            name="tarjoajat"
            disableTarjoajaHierarkia={isExistingOphKoulutus}
          />
        </FormCollapse>
      ) : null}

      <FormCollapse
        section="julkisuus"
        header="Koulutuksen näkyminen muille koulutustoimijoille"
        {...getTestIdProps('nakyvyysSection')}
      >
        <NakyvyysSection disabled={onlyTarjoajaRights} name="julkinen" />
      </FormCollapse>

      <FormCollapse
        section="julkaisutila"
        header={t('koulutuslomake.koulutuksenTila')}
        {...getTestIdProps('tilaSection')}
      >
        <JulkaisutilaSection
          disabled={onlyTarjoajaRights}
          name="tila"
          showArkistoitu={!isNewKoulutus}
        />
      </FormCollapse>

      {isFunction(onAttachToteutus) ? (
        <FormCollapse
          header={t('koulutuslomake.koulutukseenLiitetytToteutukset')}
          id="koulutukseen-liitetetyt-toteutukset"
          actions={
            <Flex justifyCenter>
              <Button
                disabled={onlyTarjoajaRights}
                color="primary"
                onClick={onAttachToteutus}
                type="button"
              >
                {t('koulutuslomake.liitaToteutus')}
              </Button>
            </Flex>
          }
        >
          <ToteutuksetSection
            disabled={onlyTarjoajaRights}
            koulutus={koulutusProp}
            organisaatioOid={organisaatioOid}
          />
        </FormCollapse>
      ) : null}
    </FormCollapseGroup>
  );
};

export default KoulutusForm;
