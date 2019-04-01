import React from 'react';
import { formValues } from 'redux-form';

import BaseSelectionSection from './BaseSelectionSection';
import KieliversiotFormSection from '../KieliversiotFormSection';
import NameSection from './NameSection';
import TargetGroupSection from './TargetGroupSection';
import SearchTypeSection from './SearchTypeSection';
import ScheduleSection from './ScheduleSection';
import FormSelectSection from './FormSelectSection';
import ContactInfoSection from './ContactInfoSection';
import FormCollapseGroup from '../FormCollapseGroup';
import FormCollapse from '../FormCollapse';
import HakukohteetModal from './HakukohteetModal';
import HakukohteetSection from './HakukohteetSection';
import { isFunction } from '../../utils';
import { ModalController } from '../Modal';
import Flex from '../Flex';
import Button from '../Button';
import useTranslation from '../useTranslation';

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

  return (
    <form onSubmit={handleSubmit}>
      <ActiveLanguages>
        {({ languages }) => (
          <FormCollapseGroup enabled={steps} scrollTarget={scrollTarget}>
            {canCopy ? (
              <FormCollapse
                header={t('yleiset.pohjanValinta')}
                section="pohja"
                onContinue={onMaybeCopy}
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
            >
              <KieliversiotFormSection />
            </FormCollapse>

            <FormCollapse header={t('hakulomake.haunNimi')} section="nimi">
              <NameSection languages={languages} />
            </FormCollapse>

            <FormCollapse
              header={t('hakulomake.haunKohdejoukko')}
              section="kohdejoukko"
            >
              <TargetGroupSection />
            </FormCollapse>

            <FormCollapse header={t('hakulomake.hakutapa')} section="hakutapa">
              <SearchTypeSection />
            </FormCollapse>

            <FormCollapse
              header={t('hakulomake.haunAikataulu')}
              section="aikataulut"
            >
              <ScheduleSection />
            </FormCollapse>

            <FormCollapse
              header={t('yleiset.hakulomakkeenValinta')}
              section="hakulomake"
            >
              <FormSelectSection />
            </FormCollapse>

            <FormCollapse
              header={t('hakulomake.haunYhteystiedot')}
              section="yhteystiedot"
            >
              <ContactInfoSection languages={languages} />
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
                          <Flex justifyEnd full>
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
