import React, { useMemo } from 'react';
import { formValues } from 'redux-form';

import BaseSelectionSection from './BaseSelectionSection';
import KieliversiotFields from '../KieliversiotFields';
import NameSection from './NameSection';
import TargetGroupSection from './TargetGroupSection';
import SearchTypeSection from './SearchTypeSection';
import ScheduleSectionBase from './ScheduleSection';
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

import { HAKU_ROLE, OPETUSHALLITUS_ORGANISAATIO_OID } from '../../constants';

const ActiveLanguages = formValues({
  languages: 'kieliversiot',
})(({ languages, ...props }) => {
  return props.children({
    languages: languages || [],
  });
});

const ScheduleSection = formValues({
  hakutapa: 'hakutapa',
})(({ hakutapa, ...props }) => (
  <ScheduleSectionBase
    isYhteishaku={isYhteishakuHakutapa(hakutapa)}
    {...props}
  />
));

const HakuForm = ({
  organisaatioOid,
  handleSubmit,
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

      <form onSubmit={handleSubmit}>
        <ActiveLanguages>
          {({ languages }) => (
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
          )}
        </ActiveLanguages>
      </form>
    </>
  );
};

export default HakuForm;
