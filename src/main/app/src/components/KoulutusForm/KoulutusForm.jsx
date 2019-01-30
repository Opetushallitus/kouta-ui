import React from 'react';
import { FormSection, formValues } from 'redux-form';
import styled from 'styled-components';

import TypeSection from './TypeSection';
import BaseSelectionSection from './BaseSelectionSection';
import LanguageSection from './LanguageSection';
import InformationSection from './InformationSection';
import DescriptionSection from './DescriptionSection';
import OrganizationSection from './OrganizationSection';
import Collapse from '../Collapse';
import Button from '../Button';
import FormStepper from '../FormStepper';
import ResetFormSection from '../ResetFormSection';
import { isObject, isFunction } from '../../utils';

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

const FormCollapse = ({ onContinue, section, children = null, ...props }) => {
  return (
    <CollapseWrapper>
      <Collapse
        footer={
          <CollapseFooterContainer>
            {section ? (
              <ResetFormSection name={section}>
                {({ onReset }) => (
                  <Button type="button" variant="outlined" onClick={onReset}>
                    Tyhjennä tiedot
                  </Button>
                )}
              </ResetFormSection>
            ) : null}

            {isFunction(onContinue) ? (
              <Button type="button" onClick={onContinue}>
                Jatka
              </Button>
            ) : null}
          </CollapseFooterContainer>
        }
        {...props}
      >
        {section ? (
          <FormSection name={section}>{children}</FormSection>
        ) : (
          children
        )}
      </Collapse>
    </CollapseWrapper>
  );
};

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

const defaultGetStepCollapseProps = () => ({
  open: true,
});

const KoulutusFormBase = ({
  handleSubmit,
  getStepCollapseProps = defaultGetStepCollapseProps,
  organisaatioOid,
}) => (
  <form onSubmit={handleSubmit}>
    <ActiveLanguages>
      {({ languages }) => (
        <>
          <FormCollapse
            header="1 Koulutustyyppi"
            section="type"
            {...getStepCollapseProps(0)}
          >
            <TypeSection />
          </FormCollapse>

          <FormCollapse
            header="2 Pohjan valinta"
            section="base"
            {...getStepCollapseProps(1)}
          >
            <BaseSelectionSection />
          </FormCollapse>

          <FormCollapse
            header="3 Kieliversiot"
            section="language"
            {...getStepCollapseProps(2)}
          >
            <LanguageSection />
          </FormCollapse>

          <ActiveKoulutusTyyppi>
            {({ koulutusTyyppi }) => (
              <FormCollapse
                header="4 Koulutuksen tiedot"
                section="information"
                {...getStepCollapseProps(3)}
              >
                <InformationSection
                  languages={languages}
                  koulutusTyyppi={koulutusTyyppi}
                />
              </FormCollapse>
            )}
          </ActiveKoulutusTyyppi>

          <ActiveKoulutus>
            {({ koulutus }) => (
              <FormCollapse
                header="5 Valitun koulutuksen kuvaus"
                section="description"
                {...getStepCollapseProps(4)}
              >
                <DescriptionSection languages={languages} koodiUri={koulutus} />
              </FormCollapse>
            )}
          </ActiveKoulutus>

          <FormCollapse
            header="6 Koulutuksen järjestävä organisaatio"
            section="organization"
            {...getStepCollapseProps(5)}
            onContinue={null}
          >
            <OrganizationSection organisaatioOid={organisaatioOid} />
          </FormCollapse>
        </>
      )}
    </ActiveLanguages>
  </form>
);

const KoulutusForm = ({ steps = false, ...props }) => {
  return steps ? (
    <FormStepper stepCount={6}>
      {({ activeStep, makeOnGoToStep }) => {
        const getStepCollapseProps = step => {
          return {
            open: activeStep >= step,
            onContinue: makeOnGoToStep(step + 1),
          };
        };

        return (
          <KoulutusFormBase
            getStepCollapseProps={getStepCollapseProps}
            {...props}
          />
        );
      }}
    </FormStepper>
  ) : (
    <KoulutusFormBase {...props} />
  );
};

export default KoulutusForm;
