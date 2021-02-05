import React from 'react';
import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import KieliversiotFields from '#/src/components/KieliversiotFields';
import Flex from '#/src/components/Flex';
import Button from '#/src/components/Button';
import { LomakeFields } from '#/src/components/LomakeFields';
import useModal from '#/src/hooks/useModal';
import isYhteishakuHakutapa from '#/src/utils/isYhteishakuHakutapa';
import { useFieldValue, useSelectedLanguages } from '#/src/hooks/form';
import JulkaisutilaField from '#/src/components/JulkaisutilaField';
import PohjaFormCollapse from '#/src/components/PohjaFormCollapse';
import getHaut from '#/src/utils/haku/getHaut';
import NameSection from './NameSection';
import TargetGroupSection from './TargetGroupSection';
import SearchTypeSection from './SearchTypeSection';
import ScheduleSection from './ScheduleSection';
import { YhteyshenkilotSection } from './YhteyshenkilotSection';
import FormCollapseGroup from '#/src/components/FormCollapseGroup';
import FormCollapse from '#/src/components/FormCollapse';
import HakukohteetModal from './HakukohteetModal';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';
import { HakukohteetSection } from './HakukohteetSection';

const HakuForm = ({
  organisaatioOid,
  canSelectBase = true,
  onAttachHakukohde = undefined,
  steps = false,
  haku: hakuProp = null,
  showArkistoituTilaOption = true,
  onSelectBase = () => {},
}) => {
  const { t } = useTranslation();
  const { isOpen, open, close } = useModal();
  const languages = useSelectedLanguages();
  const hakutapa = useFieldValue('hakutapa');
  const isYhteishaku = isYhteishakuHakutapa(hakutapa);

  const isOphVirkailija = useIsOphVirkailija();

  return (
    <>
      <HakukohteetModal
        open={isOpen}
        onClose={close}
        fieldName="hakukohteet"
        organisaatioOid={organisaatioOid}
        onSave={onAttachHakukohde}
      />
      <FormCollapseGroup enabled={steps} defaultOpen={!steps} configured>
        {canSelectBase ? (
          <PohjaFormCollapse
            section="pohja"
            scrollOnActive={false}
            onSelectBase={onSelectBase}
            infoText={t('hakulomake.pohjavalintaInfo')}
            createLabel={t('yleiset.luoUusiHaku')}
            copyLabel={t('hakulomake.kopioiPohjaksi')}
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
          languages={languages}
        />

        <FormCollapse
          section="hakulomake"
          header={t('yleiset.hakulomakkeenValinta')}
          languages={languages}
          haku={hakuProp}
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

        {_fp.isFunction(onAttachHakukohde) ? (
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
