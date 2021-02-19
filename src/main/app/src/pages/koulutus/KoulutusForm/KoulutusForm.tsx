import React from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import Button from '#/src/components/Button';
import { Flex } from '#/src/components/Flex';
import FormCollapse from '#/src/components/FormCollapse';
import FormCollapseGroup from '#/src/components/FormCollapseGroup';
import JulkaisutilaField from '#/src/components/JulkaisutilaField';
import JulkisuusSection from '#/src/components/JulkisuusSection';
import KieliversiotFields from '#/src/components/KieliversiotFields';
import PohjaFormCollapse from '#/src/components/PohjaFormCollapse';
import TeemakuvaSection from '#/src/components/TeemakuvaSection';
import { ENTITY } from '#/src/constants';
import { useFieldValue } from '#/src/hooks/form';
import {
  isSameKoulutustyyppiWithOrganisaatio,
  useOrganisaatio,
} from '#/src/hooks/useOrganisaatio';
import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';
import { getTestIdProps } from '#/src/utils';
import getKoulutukset from '#/src/utils/koulutus/getKoulutukset';
import isOphOrganisaatio from '#/src/utils/organisaatio/isOphOrganisaatio';

import JarjestajaSection from './JarjestajaSection';
import KoulutustyyppiSection from './KoulutustyyppiSection';
import KuvausSection from './KuvausSection';
import { LisatiedotSection } from './LisatiedotSection';
import OsaamisalanKuvausSection from './OsaamisalanKuvausSection';
import { OsaamisalaSection } from './OsaamisalaSection';
import TiedotSection from './TiedotSection';
import { ToteutuksetSection } from './ToteutuksetSection';
import { TutkinnonOsienKuvausSection } from './TukinnonOsienKuvausSection';
import { TutkinnonOsaKoulutusNimiSection } from './TutkinnonOsaKoulutusNimiSection';
import { TutkinnonOsatSection } from './TutkinnonOsatSection';

const isInHierarkia = org => hierarkia =>
  hierarkia.organisaatioOid === org.organisaatioOid ||
  _fp.head(hierarkia.children.filter(isInHierarkia(org)));

const KoulutusForm = ({
  organisaatioOid,
  steps = false,
  isNewKoulutus = false,
  koulutus: koulutusProp = null,
  onAttachToteutus = undefined,
  onSelectBase = undefined,
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
  const { hierarkia = [] } = useOrganisaatioHierarkia(
    koulutusProp?.organisaatioOid
  );

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
          Component={KoulutustyyppiSection}
          disabled={onlyTarjoajaRights}
          organisaatioOid={organisaatioOid}
        />
      )}
      {_fp.isFunction(onSelectBase) && (
        <PohjaFormCollapse
          onSelectBase={onSelectBase}
          organisaatioOid={organisaatioOid}
          disabled={onlyTarjoajaRights}
          getCopyEntities={getKoulutukset}
          infoText={t('koulutuslomake.pohjavalintaInfo')}
          createLabel={t('yleiset.luoUusiKoulutus')}
          copyLabel={t('koulutuslomake.kopioiPohjaksi')}
        />
      )}

      <FormCollapse
        section="kieliversiot"
        header={t('yleiset.kieliversiot')}
        Component={KieliversiotFields}
        disabled={onlyTarjoajaRights}
      />

      <FormCollapse
        section="osaamisala"
        header={t('koulutuslomake.valitseOsaamisala')}
        Component={OsaamisalaSection}
        languages={languageTabs}
        disabled={onlyTarjoajaRights}
        koulutustyyppi={koulutustyyppi}
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
        section="tutkinnonosat"
        header={t('koulutuslomake.tutkinnonOsat')}
        Component={TutkinnonOsatSection}
        name={'tutkinnonosat.osat'}
        languages={languageTabs}
        disabled={onlyTarjoajaRights}
        koulutustyyppi={koulutustyyppi}
      />

      <FormCollapse
        section="osaamisalanKuvaus"
        header={t('koulutuslomake.osaamisalanKuvaus')}
        Component={OsaamisalanKuvausSection}
        name={'osaamisala.osaamisala'}
        languages={languageTabs}
        disabled={onlyTarjoajaRights}
        koulutustyyppi={koulutustyyppi}
      />

      <FormCollapse
        section="tutkinnonosat"
        header={t('koulutuslomake.koulutuksenNimi')}
        Component={TutkinnonOsaKoulutusNimiSection}
        languages={languageTabs}
        disabled={onlyTarjoajaRights}
        koulutustyyppi={koulutustyyppi}
        {...getTestIdProps('nimiSection')}
      />

      <FormCollapse
        section="tutkinnonosat"
        header={t('koulutuslomake.tutkinnonOsienKuvaus')}
        Component={TutkinnonOsienKuvausSection}
        languages={languageTabs}
        disabled={onlyTarjoajaRights}
        koulutustyyppi={koulutustyyppi}
        {...getTestIdProps('tutkinnonOsienKuvausSection')}
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
        header={t('koulutuslomake.nakyminenMuilleToimijoille')}
        disabled={onlyTarjoajaRights}
        Component={JulkisuusSection}
        entity={ENTITY.KOULUTUS}
      />

      <FormCollapse
        section="tila"
        header={t('koulutuslomake.koulutuksenTila')}
        Component={JulkaisutilaField}
        disabled={onlyTarjoajaRights}
        showArkistoitu={!isNewKoulutus}
      />

      {_fp.isFunction(onAttachToteutus) && (
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
