import React from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import FormCollapse from '#/src/components/FormCollapse';
import FormCollapseGroup from '#/src/components/FormCollapseGroup';
import { JulkaisutilaField } from '#/src/components/JulkaisutilaField';
import KieliversiotFields from '#/src/components/KieliversiotFields';
import { LomakeFields } from '#/src/components/LomakeFields';
import { OrganisaatioSection } from '#/src/components/OrganisaatioSection';
import { OrganisaatioSectionCreate } from '#/src/components/OrganisaatioSectionCreate';
import PohjaFormCollapse from '#/src/components/PohjaFormCollapse';
import { Box, Button } from '#/src/components/virkailija';
import { ENTITY, FormMode } from '#/src/constants';
import { useFormMode } from '#/src/contexts/FormContext';
import { useFieldValue, useSelectedLanguages } from '#/src/hooks/form';
import { useCanCreateHakukohde } from '#/src/hooks/useCanCreateHakukohde';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';
import useModal from '#/src/hooks/useModal';
import getHaut from '#/src/utils/haku/getHaut';
import { useFilteredHakukohteet } from '#/src/utils/hakukohde/searchHakukohteet';
import isErillishakuHakutapa from '#/src/utils/isErillishakuHakutapa';
import isYhteishakuHakutapa from '#/src/utils/isYhteishakuHakutapa';

import { LiittajaOrganisaatiotSection } from './hakukohteenLiittajaOrganisaatiot/LiittajaOrganisaatiotSection';
import HakukohteetModal from './HakukohteetModal';
import { HakukohteetSection } from './HakukohteetSection';
import { HakutapaSection } from './HakutapaSection';
import HaunKohdejoukkoFields from './HaunKohdejoukkoFields';
import { NimiSection } from './NimiSection';
import ScheduleSection from './ScheduleSection';
import { YhteyshenkilotSection } from './YhteyshenkilotSection';

type HakuFormProps = {
  organisaatioOid: string;
  steps?: boolean;
  haku?: Record<string, any>;
  onAttachHakukohde?: (props: { toteutusOid: string }) => void;
};

const HakuForm = ({
  organisaatioOid,
  onAttachHakukohde,
  steps = false,
  haku: hakuProp,
}: HakuFormProps) => {
  const { t } = useTranslation();
  const { isOpen, open, close } = useModal();
  const languages = useSelectedLanguages();
  const hakutapa = useFieldValue('hakutapa');
  const isYhteishaku = isYhteishakuHakutapa(hakutapa);
  const isErillishaku = isErillishakuHakutapa(hakutapa);

  const isOphVirkailija = useIsOphVirkailija();

  const formMode = useFormMode();

  const canAddHakukohde = useCanCreateHakukohde(
    hakuProp?.hakukohteenLiittamisenTakaraja
  );

  const { data } = useFilteredHakukohteet(
    { hakuOid: hakuProp?.oid },
    organisaatioOid
  );

  let hakukohdeAmount = '';
  if (data?.totalCount) {
    hakukohdeAmount = ' (' + data.totalCount + ')';
  }

  const infoText = canAddHakukohde
    ? null
    : t('hakulomake.liittamisenTakarajaYlittynyt');

  return (
    <>
      <HakukohteetModal
        open={isOpen}
        onClose={close}
        organisaatioOid={organisaatioOid}
        onSave={onAttachHakukohde}
      />
      <FormCollapseGroup enabled={steps} defaultOpen={!steps}>
        {formMode === FormMode.EDIT && (
          <FormCollapse
            section="organisaatio"
            Component={OrganisaatioSection}
            header={t('yleiset.organisaatio')}
          />
        )}
        {formMode === FormMode.CREATE ? (
          <PohjaFormCollapse
            entityType={ENTITY.HAKU}
            section="pohja"
            scrollOnActive={false}
            infoText={t('hakulomake.pohjavalintaInfo')}
            createLabel={t('yleiset.luoUusiHaku')}
            copyLabel={t('hakulomake.kopioiPohjaksi')}
            organisaatioOid={organisaatioOid}
            getCopyEntities={getHaut(false)}
          />
        ) : null}
        {formMode === FormMode.CREATE && (
          <FormCollapse
            section="organisaatio"
            Component={OrganisaatioSectionCreate}
            header={t('yleiset.organisaatiovalinta')}
            organisaatioOid={organisaatioOid}
          />
        )}

        <FormCollapse
          section="kieliversiot"
          header={t('yleiset.kieliversiot')}
          Component={KieliversiotFields}
        />

        <FormCollapse
          section="nimi"
          header={t('hakulomake.haunNimi')}
          languages={languages}
          Component={NimiSection}
        />

        <FormCollapse
          section="kohdejoukko"
          header={t('hakulomake.haunKohdejoukko')}
          Component={HaunKohdejoukkoFields}
        />

        <FormCollapse
          section="hakutapa"
          header={t('hakulomake.hakutapa')}
          Component={HakutapaSection}
          isOphVirkailija={isOphVirkailija}
        />

        <FormCollapse
          section="liittajaorganisaatiot"
          header={t('hakulomake.hakukohteenliittajaorganisaatiot')}
          Component={LiittajaOrganisaatiotSection}
          organisaatioOid={organisaatioOid}
          haku={hakuProp}
        />

        <FormCollapse
          section="aikataulut"
          header={t('hakulomake.haunAikataulu')}
          Component={ScheduleSection}
          isYhteishaku={isYhteishaku}
          isErillishaku={isErillishaku}
          isOphVirkailija={isOphVirkailija}
          languages={languages}
          className="disableForReadOnly"
        />

        <FormCollapse
          section="hakulomake"
          header={t('yleiset.hakulomakkeenValinta')}
          languages={languages}
          haku={hakuProp}
          hakutapa={hakutapa}
          Component={LomakeFields}
        />

        <FormCollapse
          section="yhteyshenkilot"
          header={t('hakulomake.haunYhteystiedot')}
          languages={languages}
          Component={YhteyshenkilotSection}
          className="disableForReadOnly"
        />

        <FormCollapse
          section="tila"
          header={t('hakulomake.haunTila')}
          Component={JulkaisutilaField}
          entity={hakuProp}
        />

        {_fp.isFunction(onAttachHakukohde) ? (
          <FormCollapse
            header={t('hakulomake.liitetytHakukohteet') + ' ' + hakukohdeAmount}
            id="liitetyt-hakukohteet"
            clearable={false}
            actions={
              <Box
                display="flex"
                justifyContent="center"
                width="100%"
                height="100%"
                flexBasis="100%"
              >
                <Button
                  onClick={open}
                  disabled={!canAddHakukohde}
                  type="button"
                  title={infoText}
                  isHakukohteenLiittaja={hakuProp?.hakukohteenLiittajaOrganisaatiot.includes(
                    organisaatioOid
                  )}
                >
                  {t('yleiset.liitaHakukohde')}
                </Button>
              </Box>
            }
            Component={HakukohteetSection}
            haku={hakuProp}
            organisaatioOid={organisaatioOid}
          />
        ) : null}
      </FormCollapseGroup>
    </>
  );
};

export default HakuForm;
