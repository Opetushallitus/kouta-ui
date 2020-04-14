import React from 'react';
import _ from 'lodash';
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
import LisatiedotSection from './LisatiedotSection';
import Flex from '../Flex';
import NakyvyysSection from './NakyvyysSection';
import { useTranslation } from 'react-i18next';
import useFieldValue from '../useFieldValue';
import JulkaisutilaSection from './JulkaisutilaSection';
import isOphOrganisaatio from '../../utils/isOphOrganisaatio';
import TeemakuvaSection from '../TeemakuvaSection';
import PohjaFormCollapse from '../PohjaFormCollapse';
import {
  isSameKoulutustyyppiWithOrganisaatio,
  useOrganisaatio,
} from '../useOrganisaatio';
import useOrganisaatioHierarkia from '../useOrganisaatioHierarkia';

const isInHierarkia = org => hierarkia =>
  hierarkia.organisaatioOid === org.organisaatioOid ||
  _.first(hierarkia.children.filter(isInHierarkia(org)));

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
      {isNewKoulutus && (
        <FormCollapse
          section="koulutustyyppi"
          header={t('yleiset.koulutustyyppi')}
          scrollOnActive={false}
          Component={TypeSection}
          johtaaTutkintoon={johtaaTutkintoon}
          disabled={onlyTarjoajaRights}
        />
      )}
      {_.isFunction(onSelectBase) && (
        <PohjaFormCollapse
          section="pohja"
          header={t('yleiset.pohjanValinta')}
          onSelectBase={onSelectBase}
        >
          <BaseSelectionSection
            disabled={onlyTarjoajaRights}
            name="pohja"
            organisaatioOid={organisaatioOid}
          />
        </PohjaFormCollapse>
      )}

      <FormCollapse
        section="kieliversiot"
        header={t('yleiset.kieliversiot')}
        Component={KieliversiotFields}
        disabled={onlyTarjoajaRights}
      />

      <FormCollapse
        section="information"
        header={t('koulutuslomake.koulutuksenTiedot')}
        Component={TiedotSection}
        languages={languageTabs}
        disabled={onlyTarjoajaRights}
        koulutustyyppi={koulutustyyppi}
        koulutuskoodi={koulutuskoodi}
      />

      <FormCollapse
        section="description"
        header={t('koulutuslomake.koulutuksenKuvaus')}
        Component={KuvausSection}
        languages={languageTabs}
        disabled={onlyTarjoajaRights}
        koulutustyyppi={koulutustyyppi}
        koulutuskoodi={koulutuskoodi}
      />

      <FormCollapse
        section="lisatiedot"
        header={t('koulutuslomake.koulutuksenLisatiedot')}
        Component={LisatiedotSection}
        languages={languageTabs}
        disabled={onlyTarjoajaRights}
      />

      <FormCollapse
        section="teemakuva"
        header={t('koulutuslomake.koulutuksenTeemakuva')}
        Component={TeemakuvaSection}
        disabled={onlyTarjoajaRights}
      />

      {!isNewOphKoulutus && (
        <FormCollapse
          section="tarjoajat"
          header={t('koulutuslomake.koulutuksenJarjestaja')}
          Component={JarjestajaSection}
          organisaatioOid={organisaatioOid}
          koulutus={koulutusProp}
          disableTarjoajaHierarkia={isExistingOphKoulutus}
        />
      )}

      <FormCollapse
        section="julkinen"
        header="Koulutuksen näkyminen muille koulutustoimijoille"
        disabled={onlyTarjoajaRights}
        Component={NakyvyysSection}
      />

      <FormCollapse
        section="tila"
        header={t('koulutuslomake.koulutuksenTila')}
        Component={JulkaisutilaSection}
        disabled={onlyTarjoajaRights}
        showArkistoitu={!isNewKoulutus}
      />

      {_.isFunction(onAttachToteutus) && (
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
          Component={ToteutuksetSection}
          koulutus={koulutusProp}
          organisaatioOid={organisaatioOid}
          disabled={onlyTarjoajaRights}
        />
      )}
    </FormCollapseGroup>
  );
};

export default KoulutusForm;
