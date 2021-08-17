import React from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import Button from '#/src/components/Button';
import FormCollapse from '#/src/components/FormCollapse';
import FormCollapseGroup from '#/src/components/FormCollapseGroup';
import { JulkaisutilaField } from '#/src/components/JulkaisutilaField';
import KieliversiotFields from '#/src/components/KieliversiotFields';
import { LomakeFields } from '#/src/components/LomakeFields';
import PohjaFormCollapse from '#/src/components/PohjaFormCollapse';
import { Box } from '#/src/components/virkailija';
import { useFieldValue, useSelectedLanguages } from '#/src/hooks/form';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';
import useModal from '#/src/hooks/useModal';
import getHaut from '#/src/utils/haku/getHaut';
import isYhteishakuHakutapa from '#/src/utils/isYhteishakuHakutapa';

import HakukohteetModal from './HakukohteetModal';
import { HakukohteetSection } from './HakukohteetSection';
import { HakutapaSection } from './HakutapaSection';
import HaunKohdejoukkoFields from './HaunKohdejoukkoFields';
import { NimiSection } from './NimiSection';
import ScheduleSection from './ScheduleSection';
import { YhteyshenkilotSection } from './YhteyshenkilotSection';

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
        organisaatioOid={organisaatioOid}
        onSave={onAttachHakukohde}
      />
      <FormCollapseGroup enabled={steps} defaultOpen={!steps}>
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
              <Box
                display="flex"
                justifyContent="center"
                width="100%"
                height="100%"
                flexBasis="100%"
              >
                <Button onClick={open} type="button">
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
