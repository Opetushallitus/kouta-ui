import React, { useMemo } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import Button from '#/src/components/Button';
import FormCollapse from '#/src/components/FormCollapse';
import FormCollapseGroup from '#/src/components/FormCollapseGroup';
import { JulkaisutilaField } from '#/src/components/JulkaisutilaField';
import JulkisuusSection from '#/src/components/JulkisuusSection';
import KieliversiotFields from '#/src/components/KieliversiotFields';
import { OrganisaatioSection } from '#/src/components/OrganisaatioSection';
import { OrganisaatioSectionCreate } from '#/src/components/OrganisaatioSectionCreate';
import PohjaFormCollapse from '#/src/components/PohjaFormCollapse';
import SoraKuvausSection from '#/src/components/SoraKuvausSection';
import TeemakuvaSection from '#/src/components/TeemakuvaSection';
import { Box } from '#/src/components/virkailija';
import {
  ENTITY,
  FormMode,
  KOULUTUSTYYPPI,
  TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT,
  TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
} from '#/src/constants';
import { useFormMode } from '#/src/contexts/FormContext';
import { useFieldValue } from '#/src/hooks/form';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';
import {
  isSameKoulutustyyppiWithOrganisaatio,
  useOrganisaatio,
} from '#/src/hooks/useOrganisaatio';
import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';
import { KoulutusModel } from '#/src/types/koulutusTypes';
import { getTestIdProps, isIn, otherwise } from '#/src/utils';
import { getKoulutukset } from '#/src/utils/koulutus/getKoulutukset';
import isOphOrganisaatio from '#/src/utils/organisaatio/isOphOrganisaatio';

import { EPerusteKuvausSection } from './EPerusteKuvausSection';
import { KoulutusSaveErrorModal } from './KoulutusSaveErrorModal';
import { KoulutustyyppiSection } from './KoulutustyyppiSection';
import { KuvausFieldsSection } from './KuvausFieldsSection';
import { LisatiedotSection } from './LisatiedotSection';
import OsaamisalanKuvausSection from './OsaamisalanKuvausSection';
import { OsaamisalaSection } from './OsaamisalaSection';
import { TarjoajatSection } from './tarjoajat/TarjoajatSection';
import {
  TiedotSection,
  AikuistenPerusopetusTiedotSection,
  KkOpintokokonaisuusTiedotSection,
  TuvaTiedotSection,
  TelmaTiedotSection,
  VapaaSivistystyoOpistovuosiTiedotSection,
  MuuTiedotSection,
  KkOpintojaksoTiedotSection,
  ErikoislaakariTiedotSection,
  ErikoistumisKoulutusTiedotSection,
  TaiteenPerusopetusTiedotSection,
} from './TiedotSection/TiedotSection';
import { ToteutuksetSection } from './ToteutuksetSection';
import { TutkinnonOsienKuvausSection } from './TukinnonOsienKuvausSection';
import { TutkinnonOsaKoulutusNimiSection } from './TutkinnonOsaKoulutusNimiSection';
import { TutkinnonOsatSection } from './TutkinnonOsatSection';

const isInHierarkia = org => hierarkia =>
  hierarkia.organisaatioOid === org.organisaatioOid ||
  _fp.head(hierarkia.children.filter(isInHierarkia(org)));

type KoulutusFormProps = {
  organisaatioOid: string;
  koulutus?: KoulutusModel;
  steps?: boolean;
  onAttachToteutus?: () => void;
};

export const KoulutusForm = ({
  organisaatioOid,
  steps = false,
  koulutus: koulutusProp,
  onAttachToteutus,
}: KoulutusFormProps) => {
  const { t } = useTranslation();

  const koulutustyyppi = useFieldValue('koulutustyyppi');
  const kieliversiotValue = useFieldValue('kieliversiot');
  const koulutuskoodi = useFieldValue('information.koulutus');
  const languageTabs = kieliversiotValue || [];
  const formMode = useFormMode();
  const isNewKoulutus = formMode === FormMode.CREATE;

  const isNewOphKoulutus = isOphOrganisaatio(organisaatioOid) && isNewKoulutus;
  const isExistingOphKoulutus =
    isOphOrganisaatio(organisaatioOid) && !isNewKoulutus;

  const isOphVirkailija = useIsOphVirkailija();

  const { organisaatio } = useOrganisaatio(organisaatioOid);
  const { hierarkia = [] } = useOrganisaatioHierarkia(
    koulutusProp?.organisaatioOid
  );

  const onlyTarjoajaRights = useMemo(
    () =>
      !isNewKoulutus &&
      organisaatio &&
      hierarkia &&
      !isOphOrganisaatio(organisaatio.oid) &&
      !isInHierarkia(organisaatio)(hierarkia) &&
      isSameKoulutustyyppiWithOrganisaatio(organisaatio, hierarkia),
    [isNewKoulutus, organisaatio, hierarkia]
  );

  return (
    <>
      <KoulutusSaveErrorModal />
      <FormCollapseGroup enabled={steps} defaultOpen={!steps}>
        {formMode === FormMode.EDIT && (
          <FormCollapse
            section="organisaatio"
            Component={OrganisaatioSection}
            header={t('yleiset.organisaatio')}
          />
        )}
        {formMode === FormMode.CREATE && !isOphVirkailija && (
          <FormCollapse
            section="organisaatio"
            Component={OrganisaatioSectionCreate}
            header={t('yleiset.organisaatiovalinta')}
          />
        )}
        <FormCollapse
          section="koulutustyyppi"
          header={t('yleiset.koulutustyyppi')}
          scrollOnActive={false}
          Component={KoulutustyyppiSection}
          disabled={!isNewKoulutus || onlyTarjoajaRights}
          organisaatioOid={organisaatioOid}
        />
        {formMode === FormMode.CREATE && (
          <PohjaFormCollapse
            entityType={ENTITY.KOULUTUS}
            organisaatioOid={organisaatioOid}
            disabled={onlyTarjoajaRights}
            getCopyEntities={getKoulutukset(koulutustyyppi)}
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

        {koulutustyyppi && (
          <>
            {![
              KOULUTUSTYYPPI.TUTKINNON_OSA,
              KOULUTUSTYYPPI.OSAAMISALA,
            ].includes(koulutustyyppi) && (
              <FormCollapse
                section="information"
                header={t('koulutuslomake.koulutuksenTiedot')}
                Component={_fp.cond([
                  [_fp.isEqual(KOULUTUSTYYPPI.TUVA), () => TuvaTiedotSection],
                  [_fp.isEqual(KOULUTUSTYYPPI.TELMA), () => TelmaTiedotSection],
                  [
                    _fp.isEqual(KOULUTUSTYYPPI.AIKUISTEN_PERUSOPETUS),
                    () => AikuistenPerusopetusTiedotSection,
                  ],
                  [
                    _fp.isEqual(KOULUTUSTYYPPI.TAITEEN_PERUSOPETUS),
                    () => TaiteenPerusopetusTiedotSection,
                  ],
                  [
                    _fp.isEqual(KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_OPISTOVUOSI),
                    () => VapaaSivistystyoOpistovuosiTiedotSection,
                  ],
                  [
                    isIn([
                      KOULUTUSTYYPPI.MUU_AMMATILLINEN_KOULUTUS,
                      KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_MUU,
                    ]),
                    () => MuuTiedotSection,
                  ],
                  [
                    _fp.isEqual(KOULUTUSTYYPPI.KORKEAKOULUTUS_OPINTOJAKSO),
                    () => KkOpintojaksoTiedotSection,
                  ],
                  [
                    _fp.isEqual(KOULUTUSTYYPPI.ERIKOISLAAKARI),
                    () => ErikoislaakariTiedotSection,
                  ],
                  [
                    _fp.isEqual(
                      KOULUTUSTYYPPI.KORKEAKOULUTUS_OPINTOKOKONAISUUS
                    ),
                    () => KkOpintokokonaisuusTiedotSection,
                  ],
                  [
                    _fp.isEqual(KOULUTUSTYYPPI.ERIKOISTUMISKOULUTUS),
                    () => ErikoistumisKoulutusTiedotSection,
                  ],
                  [otherwise, () => TiedotSection],
                ])(koulutustyyppi)}
                languages={languageTabs}
                disabled={onlyTarjoajaRights}
                koulutustyyppi={koulutustyyppi}
              />
            )}

            {koulutustyyppi === KOULUTUSTYYPPI.OSAAMISALA && (
              <FormCollapse
                section="osaamisala"
                header={t('koulutuslomake.valitseOsaamisala')}
                Component={OsaamisalaSection}
                languages={languageTabs}
                disabled={onlyTarjoajaRights}
                koulutustyyppi={koulutustyyppi}
              />
            )}

            {koulutustyyppi === KOULUTUSTYYPPI.TUTKINNON_OSA && (
              <FormCollapse
                section="tutkinnonosat"
                header={t('koulutuslomake.tutkinnonOsat')}
                Component={TutkinnonOsatSection}
                name={'tutkinnonosat.osat'}
                languages={languageTabs}
                disabled={onlyTarjoajaRights}
                koulutustyyppi={koulutustyyppi}
              />
            )}

            {koulutustyyppi === KOULUTUSTYYPPI.OSAAMISALA && (
              <FormCollapse
                section="osaamisalanKuvaus"
                header={t('koulutuslomake.osaamisalanKuvaus')}
                Component={OsaamisalanKuvausSection}
                name={'osaamisala.osaamisala'}
                languages={languageTabs}
                disabled={onlyTarjoajaRights}
                koulutustyyppi={koulutustyyppi}
              />
            )}

            {koulutustyyppi === KOULUTUSTYYPPI.TUTKINNON_OSA && (
              <FormCollapse
                section="tutkinnonosat"
                header={t('koulutuslomake.koulutuksenNimi')}
                Component={TutkinnonOsaKoulutusNimiSection}
                languages={languageTabs}
                disabled={onlyTarjoajaRights}
                koulutustyyppi={koulutustyyppi}
                {...getTestIdProps('nimiSection')}
              />
            )}

            {koulutustyyppi === KOULUTUSTYYPPI.TUTKINNON_OSA && (
              <FormCollapse
                section="tutkinnonosat"
                header={t('koulutuslomake.tutkinnonOsienKuvaus')}
                Component={TutkinnonOsienKuvausSection}
                languages={languageTabs}
                disabled={onlyTarjoajaRights}
                koulutustyyppi={koulutustyyppi}
                {...getTestIdProps('tutkinnonOsienKuvausSection')}
              />
            )}

            {TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT.includes(
              koulutustyyppi
            ) && (
              <FormCollapse
                section="description"
                header={t('koulutuslomake.koulutuksenKuvaus')}
                Component={EPerusteKuvausSection}
                languages={languageTabs}
                disabled={onlyTarjoajaRights}
                koulutustyyppi={koulutustyyppi}
                koulutuskoodi={koulutuskoodi}
              />
            )}
            {/* TODO: Mille kaikille koulutustyypeille kuvaus-kenttä pitäisi näyttää? 
              Monien koulutustyyppien metadatassa on kuvaus-kenttä, mutta siihen ei voi syöttää mitään. */}
            {[
              KOULUTUSTYYPPI.LUKIOKOULUTUS,
              KOULUTUSTYYPPI.TUVA,
              KOULUTUSTYYPPI.TELMA,
              KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_MUU,
              KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_OPISTOVUOSI,
              KOULUTUSTYYPPI.AMMATILLINEN_OPETTAJA_ERITYISOPETTAJA_JA_OPOKOULUTUS,
              KOULUTUSTYYPPI.OPETTAJIEN_PEDAGOGISET_OPINNOT,
              KOULUTUSTYYPPI.MUU_AMMATILLINEN_KOULUTUS,
              KOULUTUSTYYPPI.AIKUISTEN_PERUSOPETUS,
              KOULUTUSTYYPPI.TAITEEN_PERUSOPETUS,
              KOULUTUSTYYPPI.KORKEAKOULUTUS_OPINTOJAKSO,
              KOULUTUSTYYPPI.ERIKOISLAAKARI,
              KOULUTUSTYYPPI.KORKEAKOULUTUS_OPINTOKOKONAISUUS,
              KOULUTUSTYYPPI.ERIKOISTUMISKOULUTUS,
              ...TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
            ].includes(koulutustyyppi) && (
              <FormCollapse
                section="description"
                header={t('koulutuslomake.koulutuksenKuvaus')}
                Component={KuvausFieldsSection}
                languages={languageTabs}
                disabled={onlyTarjoajaRights}
                koulutustyyppi={koulutustyyppi}
                koulutuskoodi={koulutuskoodi}
              />
            )}

            {![
              KOULUTUSTYYPPI.TUVA,
              KOULUTUSTYYPPI.TELMA,
              KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_OPISTOVUOSI,
              KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_MUU,
              KOULUTUSTYYPPI.MUU_AMMATILLINEN_KOULUTUS,
              KOULUTUSTYYPPI.AIKUISTEN_PERUSOPETUS,
            ].includes(koulutustyyppi) && (
              <FormCollapse
                section="lisatiedot"
                header={t('koulutuslomake.koulutuksenLisatiedot')}
                Component={LisatiedotSection}
                languages={languageTabs}
                disabled={onlyTarjoajaRights}
              />
            )}

            {![
              KOULUTUSTYYPPI.TUVA,
              KOULUTUSTYYPPI.TELMA,
              KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_OPISTOVUOSI,
              KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_MUU,
              KOULUTUSTYYPPI.MUU_AMMATILLINEN_KOULUTUS,
              KOULUTUSTYYPPI.AIKUISTEN_PERUSOPETUS,
              KOULUTUSTYYPPI.ERIKOISLAAKARI,
            ].includes(koulutustyyppi) && (
              <FormCollapse
                section="soraKuvaus"
                header={t('yleiset.soraKuvaus')}
                Component={SoraKuvausSection}
                organisaatioOid={organisaatioOid}
                languages={languageTabs}
              />
            )}

            <FormCollapse
              section="teemakuva"
              header={t('koulutuslomake.koulutuksenTeemakuva')}
              Component={TeemakuvaSection}
              disabled={onlyTarjoajaRights}
            />

            {!isNewOphKoulutus && (
              <FormCollapse
                section="tarjoajat"
                header={t('koulutuslomake.koulutuksenTarjoajat')}
                Component={TarjoajatSection}
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
              hidden={!koulutustyyppi}
            />

            <FormCollapse
              section="tila"
              header={t('koulutuslomake.koulutuksenTila')}
              Component={JulkaisutilaField}
              disabled={onlyTarjoajaRights}
              entity={koulutusProp}
            />

            {_fp.isFunction(onAttachToteutus) && (
              <FormCollapse
                header={t('koulutuslomake.koulutukseenLiitetytToteutukset')}
                id="koulutukseen-liitetetyt-toteutukset"
                actions={
                  <Box display="flex" justifyContent="center">
                    <Button
                      disabled={onlyTarjoajaRights}
                      color="primary"
                      onClick={onAttachToteutus}
                      type="button"
                    >
                      {t('koulutuslomake.liitaToteutus')}
                    </Button>
                  </Box>
                }
                Component={ToteutuksetSection}
                koulutus={koulutusProp}
                organisaatioOid={organisaatioOid}
                disabled={onlyTarjoajaRights}
              />
            )}
          </>
        )}
      </FormCollapseGroup>
    </>
  );
};
