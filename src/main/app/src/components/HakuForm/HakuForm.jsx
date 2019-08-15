import React, { useMemo, useCallback } from 'react';
import get from 'lodash/get';

import BaseSelectionSection from './BaseSelectionSection';
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
import { isFunction, getTestIdProps } from '../../utils';
import Flex from '../Flex';
import Button from '../Button';
import useTranslation from '../useTranslation';
import LomakeSection from './LomakeSection';
import useAuthorizedUserRoleBuilder from '../useAuthorizedUserRoleBuilder';
import ValintakoeSection from './ValintakoeSection';
import useModal from '../useModal';
import isYhteishakuHakutapa from '../../utils/isYhteishakuHakutapa';
import useFieldValue from '../useFieldValue';
import { HAKU_ROLE, OPETUSHALLITUS_ORGANISAATIO_OID } from '../../constants';

const PohjaFormCollapse = ({
  children,
  onContinue,
  onSelectBase,
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

const HakuForm = ({
  organisaatioOid,
  canSelectBase = true,
  onAttachHakukohde,
  steps = false,
  scrollTarget,
  haku: hakuProp = null,
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
            scrollOnActive={false}
            onSelectBase={onSelectBase}
            {...getTestIdProps('pohjaSection')}
          >
            <BaseSelectionSection
              organisaatioOid={organisaatioOid}
              name="pohja"
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
          section="nimi"
          header={t('hakulomake.haunNimi')}
          languages={languages}
          {...getTestIdProps('nimiSection')}
        >
          <NameSection name="nimi" />
        </FormCollapse>

        <FormCollapse
          section="kohdejoukko"
          header={t('hakulomake.haunKohdejoukko')}
          {...getTestIdProps('kohdejoukkoSection')}
        >
          <TargetGroupSection name="kohdejoukko" />
        </FormCollapse>

        <FormCollapse
          section="hakutapa"
          header={t('hakulomake.hakutapa')}
          {...getTestIdProps('hakutapaSection')}
        >
          <SearchTypeSection name="hakutapa" />
        </FormCollapse>

        <FormCollapse
          section="aikataulu"
          header={t('hakulomake.haunAikataulu')}
          {...getTestIdProps('aikatauluSection')}
        >
          <ScheduleSection
            name="aikataulut"
            isYhteishaku={isYhteishaku}
            isOphVirkailija={isOphVirkailija}
          />
        </FormCollapse>

        <FormCollapse
          section="hakulomake"
          header={t('yleiset.hakulomakkeenValinta')}
          languages={languages}
          {...getTestIdProps('hakulomakeSection')}
        >
          <LomakeSection />
        </FormCollapse>

        <FormCollapse
          section="valintakoe"
          header={t('yleiset.valintakoe')}
          languages={languages}
          {...getTestIdProps('valintakoeSection')}
        >
          <ValintakoeSection name="valintakoe" />
        </FormCollapse>

        <FormCollapse
          section="yhteystiedot"
          header={t('hakulomake.haunYhteystiedot')}
          languages={languages}
          {...getTestIdProps('yhteystiedotSection')}
        >
          <YhteyshenkilotSection name="yhteyshenkilot" />
        </FormCollapse>

        {isFunction(onAttachHakukohde) ? (
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
          >
            <HakukohteetSection
              haku={hakuProp}
              organisaatioOid={organisaatioOid}
            />
          </FormCollapse>
        ) : null}
      </FormCollapseGroup>
    </>
  );
};

export default HakuForm;
