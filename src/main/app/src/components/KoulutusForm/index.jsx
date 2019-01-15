import React from 'react';
import { FormSection, formValues } from 'redux-form';
import styled from 'styled-components';

import TypeSection from './TypeSection';
import BaseSelectionSection from './BaseSelectionSection';
import LanguageSection from './LanguageSection';
import InformationSection from './InformationSection';
import DescriptionSection from './DescriptionSection';
import OrganizationSection from './OrganizationSection';
import ImplementationSection from './ImplementationSection';
import { UncontrolledCollapse } from '../Collapse';
import Button from '../Button';
import { isObject } from 'util';

const CollapseFooterContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CollapseWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.unit * 3}px;
`;

const LANGUAGES = [
  { label: 'Suomeksi', value: 'fi' },
  { label: 'Ruotsiksi', value: 'sv' },
  { label: 'Englanniksi', value: 'en' },
];

const FormCollapse = ({
  onClear = () => {},
  onContinue = () => {},
  ...props
}) => (
  <CollapseWrapper>
    <UncontrolledCollapse
      footer={
        <CollapseFooterContainer>
          <Button type="button" variant="outlined" onClick={onClear}>
            Tyhjennä tiedot
          </Button>
          <Button type="button" onClick={onContinue}>
            Jatka
          </Button>
        </CollapseFooterContainer>
      }
      defaultOpen={true}
      {...props}
    />
  </CollapseWrapper>
);

const ImplementationCollapse = ({
  onClear = () => {},
  onIncludeImplementation = () => {},
  ...props
}) => (
  <CollapseWrapper>
    <UncontrolledCollapse
      footer={
        <CollapseFooterContainer>
          <Button type="button" variant="outlined" onClick={onClear}>
            Tyhjennä tiedot
          </Button>
          <Button type="button" onClick={onIncludeImplementation}>
            Liitä toteutus
          </Button>
        </CollapseFooterContainer>
      }
      defaultOpen={true}
      {...props}
    />
  </CollapseWrapper>
);

const ActiveLanguages = formValues({
  language: 'language',
})(({ language, ...props }) => {
  const activeLanguages = isObject(language)
    ? Object.keys(language).filter(key => !!language[key])
    : [];

  return props.children({
    languages: LANGUAGES.filter(({ value }) => activeLanguages.includes(value)),
  });
});

const ActiveKoulutusTyyppi = formValues({
  koulutusTyyppi: 'type.type',
})(({ koulutusTyyppi, children }) => children({ koulutusTyyppi }));

const ActiveKoulutus = formValues({
  koulutus: 'information.koulutus',
})(({ koulutus, children }) => children({ koulutus }));

const KoulutusForm = ({ handleSubmit, ...props }) => {
  return (
    <form onSubmit={handleSubmit}>
      <ActiveLanguages>
        {({ languages }) => (
          <>
            <FormCollapse header="1 Koulutustyyppi">
              <FormSection name="type">
                <TypeSection />
              </FormSection>
            </FormCollapse>

            <FormCollapse header="2 Pohjan valinta">
              <FormSection name="base">
                <BaseSelectionSection />
              </FormSection>
            </FormCollapse>

            <FormCollapse header="3 Kieliversiot">
              <FormSection name="language">
                <LanguageSection />
              </FormSection>
            </FormCollapse>

            <FormCollapse header="4 Koulutuksen tiedot">
              <ActiveKoulutusTyyppi>
                {({ koulutusTyyppi }) => (
                  <FormSection name="information">
                    <InformationSection
                      languages={languages}
                      koulutusTyyppi={koulutusTyyppi}
                    />
                  </FormSection>
                )}
              </ActiveKoulutusTyyppi>
            </FormCollapse>

            <FormCollapse header="5 Valitun koulutuksen kuvaus">
              <ActiveKoulutus>
                {({ koulutus }) => (
                  <FormSection name="description">
                    <DescriptionSection
                      languages={languages}
                      koodiUri={koulutus}
                    />
                  </FormSection>
                )}
              </ActiveKoulutus>
            </FormCollapse>

            <FormCollapse header="6 Koulutuksen järjestävä organisaatio">
              <FormSection name="organization">
                <OrganizationSection />
              </FormSection>
            </FormCollapse>

            <ImplementationCollapse header="7 Koulutukseen liitetyt toteutukset">
              <FormSection name="implementation">
                <ImplementationSection />
              </FormSection>
            </ImplementationCollapse>
          </>
        )}
      </ActiveLanguages>
    </form>
  );
};

export default KoulutusForm;
