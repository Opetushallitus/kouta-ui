import React from 'react';
import { formValues } from 'redux-form';

import BaseSelectionSection from './BaseSelectionSection';
import KieliversiotFormSection from '../KieliversiotFormSection';
import { LANGUAGE_TABS } from '../../constants';
import NameSection from './NameSection';
import TargetGroupSection from './TargetGroupSection'
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

const ActiveLanguages = formValues({
  languages: 'kieliversiot.languages',
})(({ languages, ...props }) => {
  const activeLanguages = languages || [];

  return props.children({
    languages: LANGUAGE_TABS.filter(({ value }) =>
      activeLanguages.includes(value),
    ),
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
}) => (
  <form onSubmit={handleSubmit}>
    <ActiveLanguages>
      {({ languages }) => (
        <FormCollapseGroup enabled={steps} scrollTarget={scrollTarget}>
          {canCopy ? (
            <FormCollapse
              header="Pohjan valinta"
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
            header="Kieliversiot"
            section="kieliversiot"
          >
            <KieliversiotFormSection />
          </FormCollapse>

          <FormCollapse
            header="Haun nimi"
            section="nimi"
          >
            <NameSection languages={languages} />
          </FormCollapse>

          <FormCollapse
            header="Haun kohdejoukko"
            section="kohdejoukko"
          >
            <TargetGroupSection />
          </FormCollapse>

          <FormCollapse
            header="Hakutapa"
            section="hakutapa"
          >
            <SearchTypeSection />
          </FormCollapse>

          <FormCollapse
            header="Haun aikataulut"
            section="aikataulut"
          >
            <ScheduleSection />
          </FormCollapse>

          <FormCollapse
            header="Hakulomakkeen valinta"
            section="hakulomake"
          >
            <FormSelectSection />
          </FormCollapse>

          <FormCollapse
            header="Haun yhteystiedot"
            section="yhteystiedot"
          >
            <ContactInfoSection languages={languages} />

          </FormCollapse>
          {isFunction(onAttachHakukohde) ? (
            <FormCollapse
              header="Liitetyt hakukohteet"
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
                            Liitä hakukohde
                          </Button>
                        </Flex>
                      )}
                    </ModalController>
                  )}
                </HakukohteetPohjaFieldValue>
              }
            >
              <HakukohteetSection haku={hakuProp} organisaatioOid={organisaatioOid} />
            </FormCollapse>
          ) : null}
          </FormCollapseGroup>
      )}
    </ActiveLanguages>
  </form>
);

export default HakuForm;
