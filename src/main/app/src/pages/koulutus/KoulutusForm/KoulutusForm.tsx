import React from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import Button from '#/src/components/Button';
import FormCollapse from '#/src/components/FormCollapse';
import FormCollapseGroup from '#/src/components/FormCollapseGroup';
import { JulkaisutilaField } from '#/src/components/JulkaisutilaField';
import JulkisuusSection from '#/src/components/JulkisuusSection';
import KieliversiotFields from '#/src/components/KieliversiotFields';
import { OrganisaatioSection } from '#/src/components/OrganisaatioSection';
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
import { JarjestajaSection } from './JarjestajaSection';
import { KoulutustyyppiSection } from './KoulutustyyppiSection';
import { KuvausFieldsSection } from './KuvausFieldsSection';
import { LisatiedotSection } from './LisatiedotSection';
import OsaamisalanKuvausSection from './OsaamisalanKuvausSection';
import { OsaamisalaSection } from './OsaamisalaSection';
import { TiedotSection } from './TiedotSection/TiedotSection';
import { TuvaTiedotSection } from './TiedotSection/TuvaTiedotSection';
import { VapaaSivistystyoTiedotSection } from './TiedotSection/VapaaSivistystyoTiedotSection';
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
  isNewKoulutus?: boolean;
  steps?: boolean;
  onSelectBase?: (pohjavalinta: PohjaValinta) => void;
  onAttachToteutus?: () => void;
};

export const KoulutusForm = ({
  organisaatioOid,
  steps = false,
  isNewKoulutus = false,
  koulutus: koulutusProp,
  onAttachToteutus,
  onSelectBase,
}: KoulutusFormProps) => {
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
    isSameKoulutustyyppiWithOrganisaatio(organisaatio, hierarkia);

  const formMode = useFormMode();

  return (
    <FormCollapseGroup enabled={steps} defaultOpen={!steps}>
      {formMode === FormMode.EDIT && (
        <FormCollapse
          section="organisaatio"
          Component={OrganisaatioSection}
          header={t('yleiset.organisaatio')}
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
      {_fp.isFunction(onSelectBase) && (
        <PohjaFormCollapse
          onSelectBase={onSelectBase}
          organisaatioOid={organisaatioOid}
          disabled={onlyTarjoajaRights}
          getCopyEntities={getKoulutukset(koulutustyyppi)}
          infoText={t('koulutuslomake.pohjavalintaInfo')}
          createLabel={t('yleiset.luoUusiKoulutus')}
          copyLabel={t('koulutuslomake.kopioiPohjaksi')}
        />
      )}

      {koulutustyyppi && (
        <>
          <FormCollapse
            section="kieliversiot"
            header={t('yleiset.kieliversiot')}
            Component={KieliversiotFields}
            disabled={onlyTarjoajaRights}
          />

          {![KOULUTUSTYYPPI.TUTKINNON_OSA, KOULUTUSTYYPPI.OSAAMISALA].includes(
            koulutustyyppi
          ) && (
            <FormCollapse
              section="information"
              header={t('koulutuslomake.koulutuksenTiedot')}
              Component={_fp.cond([
                [isIn([KOULUTUSTYYPPI.TUVA]), () => TuvaTiedotSection],
                [
                  isIn([
                    KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_OPISTOVUOSI,
                    KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_MUU,
                  ]),
                  () => VapaaSivistystyoTiedotSection,
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
            KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_MUU,
            KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_OPISTOVUOSI,
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
            KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_OPISTOVUOSI,
            KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_MUU,
          ].includes(koulutustyyppi) && (
            <>
              <FormCollapse
                section="lisatiedot"
                header={t('koulutuslomake.koulutuksenLisatiedot')}
                Component={LisatiedotSection}
                languages={languageTabs}
                disabled={onlyTarjoajaRights}
              />
              <FormCollapse
                section="soraKuvaus"
                header={t('yleiset.soraKuvaus')}
                Component={SoraKuvausSection}
                organisaatioOid={organisaatioOid}
                languages={languageTabs}
              />
            </>
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
  );
};
