import React, { useMemo } from 'react';

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

const HakuForm = ({
  organisaatioOid,
  onCopy = () => {},
  onMaybeCopy = () => {},
  onCreateNew = () => {},
  canCopy = true,
  onAttachHakukohde,
  steps = false,
  scrollTarget,
  haku: hakuProp = null,
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
      roleBuilder.hasWrite(HAKU_ROLE, OPETUSHALLITUS_ORGANISAATIO_OID).result(),
    [roleBuilder],
  );

  return (
    <>
      <HakukohteetModal
        open={isOpen}
        onClose={close}
        fieldName="toteutukset"
        organisaatioOid={organisaatioOid}
        onSave={onAttachHakukohde}
      />
      <FormCollapseGroup
        enabled={steps}
        scrollTarget={scrollTarget}
        defaultOpen={!steps}
      >
        {canCopy ? (
          <FormCollapse
            header={t('yleiset.pohjanValinta')}
            onContinue={onMaybeCopy}
            scrollOnActive={false}
            {...getTestIdProps('pohjaSection')}
          >
            {({ onContinue }) => (
              <BaseSelectionSection
                onContinue={onContinue}
                organisaatioOid={organisaatioOid}
                onCopy={onCopy}
                onCreateNew={onCreateNew}
                name="pohja"
              />
            )}
          </FormCollapse>
        ) : null}

        <FormCollapse
          header={t('yleiset.kieliversiot')}
          {...getTestIdProps('kieliversiotSection')}
        >
          <KieliversiotFields name="kieliversiot" />
        </FormCollapse>

        <FormCollapse
          header={t('hakulomake.haunNimi')}
          languages={languages}
          {...getTestIdProps('nimiSection')}
        >
          <NameSection name="nimi" />
        </FormCollapse>

        <FormCollapse
          header={t('hakulomake.haunKohdejoukko')}
          {...getTestIdProps('kohdejoukkoSection')}
        >
          <TargetGroupSection name="kohdejoukko" />
        </FormCollapse>

        <FormCollapse
          header={t('hakulomake.hakutapa')}
          {...getTestIdProps('hakutapaSection')}
        >
          <SearchTypeSection name="hakutapa" />
        </FormCollapse>

        <FormCollapse
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
          header={t('yleiset.hakulomakkeenValinta')}
          languages={languages}
          {...getTestIdProps('hakulomakeSection')}
        >
          <LomakeSection />
        </FormCollapse>

        <FormCollapse
          header={t('yleiset.valintakoe')}
          languages={languages}
          {...getTestIdProps('valintakoeSection')}
        >
          <ValintakoeSection name="valintakoe" />
        </FormCollapse>

        <FormCollapse
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
