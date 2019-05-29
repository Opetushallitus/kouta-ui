import React, { useMemo } from 'react';
import { formValues } from 'redux-form';

import BaseSelectionSection from './BaseSelectionSection';
import KieliversiotFormSection from '../KieliversiotFormSection';
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
import { ModalController } from '../Modal';
import Flex from '../Flex';
import Button from '../Button';
import useTranslation from '../useTranslation';
import LomakeSection from './LomakeSection';
import useAuthorizedUser from '../useAuthorizedUser';
import ValintakoeSection from './ValintakoeSection';
import userHasOrganisaatioRoles from '../../utils/userHasOrganisaatioRoles';

import {
  HAKUTAPA_YHTEISHAKU_KOODI_URI,
  KOUTA_CRUD_ROLE,
  OPETUSHALLITUS_ORGANISAATIO_OID,
} from '../../constants';

const ActiveLanguages = formValues({
  languages: 'kieliversiot.languages',
})(({ languages, ...props }) => {
  return props.children({
    languages: languages || [],
  });
});

const HakukohteetPohjaFieldValue = formValues({
  pohja: 'hakukohteet.pohja',
})(({ pohja, children }) => children({ pohja }));

const ScheduleSection = formValues({
  hakutapa: 'hakutapa',
})(({ hakutapa, ...props }) => (
  <ScheduleSectionBase
    isYhteishaku={new RegExp(HAKUTAPA_YHTEISHAKU_KOODI_URI).test(
      hakutapa || '',
    )}
    {...props}
  />
));

const hakukohteetModal = props => <HakukohteetModal {...props} />;

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
  const user = useAuthorizedUser();

  const isOphVirkailija = useMemo(
    () =>
      userHasOrganisaatioRoles(user, OPETUSHALLITUS_ORGANISAATIO_OID, [
        KOUTA_CRUD_ROLE,
      ]),
    [user],
  );

  return (
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
                section="pohja"
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
                  />
                )}
              </FormCollapse>
            ) : null}

            <FormCollapse
              header={t('yleiset.kieliversiot')}
              section="kieliversiot"
              {...getTestIdProps('kieliversiotSection')}
            >
              <KieliversiotFormSection />
            </FormCollapse>

            <FormCollapse
              header={t('hakulomake.haunNimi')}
              section="nimi"
              languages={languages}
              {...getTestIdProps('nimiSection')}
            >
              <NameSection />
            </FormCollapse>

            <FormCollapse
              header={t('hakulomake.haunKohdejoukko')}
              section="kohdejoukko"
              {...getTestIdProps('kohdejoukkoSection')}
            >
              <TargetGroupSection />
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
                  <HakukohteetPohjaFieldValue>
                    {({ pohja }) => (
                      <ModalController
                        modal={hakukohteetModal}
                        pohjaValue={pohja}
                        fieldName="toteutukset"
                        organisaatioOid={organisaatioOid}
                        onSave={onAttachHakukohde}
                      >
                        {({ onToggle }) => (
                          <Flex justifyCenter full>
                            <Button onClick={onToggle} type="button">
                              {t('yleiset.liitaHakukohde')}
                            </Button>
                          </Flex>
                        )}
                      </ModalController>
                    )}
                  </HakukohteetPohjaFieldValue>
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
  );
};

export default HakuForm;
