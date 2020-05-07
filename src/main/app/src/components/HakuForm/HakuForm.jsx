import React, { useMemo } from 'react';
import _ from 'lodash';
import KieliversiotFields from '../KieliversiotFields';
import NameSection from './NameSection';
import TargetGroupSection from './TargetGroupSection';
import SearchTypeSection from './SearchTypeSection';
import ScheduleSection from './ScheduleSection';
import YhteyshenkilotSection from './YhteyshenkilotSection';
import FormCollapseGroup from '../FormCollapseGroup';
import FormCollapse from '../FormCollapse';
import HakukohteetModal from './HakukohteetModal';
import HakukohteetSection from './HakukohteetSection';
import Flex from '../Flex';
import Button from '../Button';
import { useTranslation } from 'react-i18next';
import LomakeFields from '../LomakeFields';
import useAuthorizedUserRoleBuilder from '../useAuthorizedUserRoleBuilder';
import useModal from '../useModal';
import isYhteishakuHakutapa from '../../utils/isYhteishakuHakutapa';
import { useFieldValue } from '#/src/hooks/form';
import { HAKU_ROLE, OPETUSHALLITUS_ORGANISAATIO_OID } from '../../constants';
import JulkaisutilaField from '#/src/components/JulkaisutilaField';
import PohjaFormCollapse from '../PohjaFormCollapse';
import PohjaValintaSection from '../PohjaValintaSection';
import getHaut from '#/src/utils/kouta/getHaut';

const HakuForm = ({
  organisaatioOid,
  canSelectBase = true,
  onAttachHakukohde,
  steps = false,
  scrollTarget,
  haku: hakuProp = null,
  showArkistoituTilaOption = true,
  onSelectBase = () => {},
}) => {
  const { t } = useTranslation();
  const roleBuilder = useAuthorizedUserRoleBuilder();
  const { isOpen, open, close } = useModal();
  const kieliversiot = useFieldValue('kieliversiot');
  const languages = kieliversiot || [];
  const hakutapa = useFieldValue('hakutapa');
  const isYhteishaku = isYhteishakuHakutapa(hakutapa);

  const isOphVirkailija = useMemo(
    () =>
      roleBuilder
        .hasUpdate(HAKU_ROLE, OPETUSHALLITUS_ORGANISAATIO_OID)
        .result(),
    [roleBuilder],
  );

  return (
    <>
      <HakukohteetModal
        open={isOpen}
        onClose={close}
        fieldName="hakukohteet"
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
            Component={PohjaValintaSection}
            scrollOnActive={false}
            onSelectBase={onSelectBase}
            infoText={t('hakulomake.pohjavalintaInfo')}
            createLabel={t('yleiset.luoUusi', { entity: t('yleiset.haku') })}
            copyLabel={t('yleiset.kopioiPohjaksi', {
              entity: t('yleiset.haku'),
            })}
            organisaatioOid={organisaatioOid}
            getCopyEntities={getHaut}
          />
        ) : null}

        <FormCollapse
          section="kieliversiot"
          header={t('yleiset.kieliversiot')}
          Component={KieliversiotFields}
        />

        <FormCollapse
          section="nimi"
          header={t('hakulomake.haunNimi')}
          languages={languages}
          Component={NameSection}
        />

        <FormCollapse
          section="kohdejoukko"
          header={t('hakulomake.haunKohdejoukko')}
          Component={TargetGroupSection}
        />

        <FormCollapse
          section="hakutapa"
          header={t('hakulomake.hakutapa')}
          Component={SearchTypeSection}
        />

        <FormCollapse
          section="aikataulut"
          header={t('hakulomake.haunAikataulu')}
          Component={ScheduleSection}
          isYhteishaku={isYhteishaku}
          isOphVirkailija={isOphVirkailija}
        />

        <FormCollapse
          section="hakulomake"
          header={t('yleiset.hakulomakkeenValinta')}
          languages={languages}
          Component={LomakeFields}
        />

        <FormCollapse
          section="yhteyshenkilot"
          header={t('hakulomake.haunYhteystiedot')}
          languages={languages}
          Component={YhteyshenkilotSection}
        />

        <FormCollapse
          section="tila"
          header={t('hakulomake.haunTila')}
          Component={JulkaisutilaField}
          showArkistoitu={showArkistoituTilaOption}
        />

        {_.isFunction(onAttachHakukohde) ? (
          <FormCollapse
            header={t('hakulomake.liitetytHakukohteet')}
            id="liitetyt-hakukohteet"
            clearable={false}
            actions={
              <Flex justifyCenter full>
                <Button onClick={open} type="button">
                  {t('yleiset.liitaHakukohde')}
                </Button>
              </Flex>
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
