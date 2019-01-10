import React from 'react';
import { FormSection } from 'redux-form';
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

const CollapseFooterContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CollapseWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.unit * 3}px;
`;

const languages = [
  { label: 'Suomeksi', value: 'fi' },
  { label: 'Ruotsiksi', value: 'se' },
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
          <Button variant="outlined" onClick={onClear}>
            Tyhjennä tiedot
          </Button>
          <Button onClick={onContinue}>Jatka</Button>
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
          <Button variant="outlined" onClick={onClear}>
            Tyhjennä tiedot
          </Button>
          <Button onClick={onIncludeImplementation}>Liitä toteutus</Button>
        </CollapseFooterContainer>
      }
      defaultOpen={true}
      {...props}
    />
  </CollapseWrapper>
);

const EducationForm = ({ handleSubmit, ...props }) => {
  return (
    <form onSubmit={handleSubmit} {...props}>
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
        <FormSection name="information">
          <InformationSection languages={languages} />
        </FormSection>
      </FormCollapse>

      <FormCollapse header="5 Valitun koulutuksen kuvaus">
        <FormSection name="description">
          <DescriptionSection languages={languages} />
        </FormSection>
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
    </form>
  );
};

export default EducationForm;
