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

const HakuForm = ({
  organisaatioOid,
  handleSubmit,
  onCopy = () => {},
  onMaybeCopy = () => {},
  onCreateNew = () => {},
  steps = false,
}) => (
  <form onSubmit={handleSubmit}>
    <ActiveLanguages>
      {({ languages }) => (
        <FormCollapseGroup enabled={steps}>
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
          </FormCollapseGroup>
      )}
    </ActiveLanguages>
  </form>
);

export default HakuForm;
