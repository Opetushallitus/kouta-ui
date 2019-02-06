import React from 'react';
import { FormSection, formValues } from 'redux-form';
import styled from 'styled-components';

import BaseSelectionSection from './BaseSelectionSection';
import KieliversiotFormSection from '../KieliversiotFormSection';
import Collapse from '../Collapse';
import Button from '../Button';
import FormStepper from '../FormStepper';
import ResetFormSection from '../ResetFormSection';
import { isObject, isFunction } from '../../utils';
import NameSection from './NameSection';
import TargetGroupSection from './TargetGroupSection'
import SearchTypeSection from './SearchTypeSection';
import ScheduleSection from './ScheduleSection';
import FormSelectSection from './FormSelectSection';
import ContactInfoSection from './ContactInfoSection';

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

const defaultGetStepCollapseProps = () => ({
  open: true,
});

const HakuFormBase = ({
  handleSubmit,
  getStepCollapseProps = defaultGetStepCollapseProps,
}) => (
  <form onSubmit={handleSubmit}>
    <ActiveLanguages>
      {({ languages }) => (
        <>
          <FormCollapse
            header="1 Pohjan valinta"
            section="pohja"
            {...getStepCollapseProps(0)}
          >
            <BaseSelectionSection />
          </FormCollapse>

          <FormCollapse
            header="2 Kieliversiot"
            section="kieliversiot"
            {...getStepCollapseProps(1)}
          >
            <KieliversiotFormSection />
          </FormCollapse>

          <FormCollapse
            header="3 Haun nimi"
            section="nimi"
            {...getStepCollapseProps(2)}
          >
            <NameSection languages={languages} />
          </FormCollapse>

          <FormCollapse
            header="4 Haun kohdejoukko"
            section="kohdejoukko"
            {...getStepCollapseProps(3)}
          >
            <TargetGroupSection />
          </FormCollapse>

          <FormCollapse
            header="5 Haukutapa"
            section="hakutapa"
            {...getStepCollapseProps(4)}
          >
            <SearchTypeSection />
          </FormCollapse>

          <FormCollapse
            header="6 Haun aikataulut"
            section="aikataulut"
            {...getStepCollapseProps(5)}
          >
            <ScheduleSection />
          </FormCollapse>

          <FormCollapse
            header="7 Hakulomakkeen valinta"
            section="hakulomake"
            {...getStepCollapseProps(6)}
          >
            <FormSelectSection languages={languages} />
          </FormCollapse>

          <FormCollapse
            header="8 Haun yhteystiedot"
            section="yhteystiedot"
            {...getStepCollapseProps(7)}
          >
            <ContactInfoSection languages={languages} />
          </FormCollapse>
        </>
      )}
    </ActiveLanguages>
  </form>
);

const HakuForm = ({ steps = false, ...props }) => {
  return steps ? (
    <FormStepper stepCount={9}>
      {({ activeStep, makeOnGoToStep }) => {
        const getStepCollapseProps = step => {
          return {
            open: activeStep >= step,
            onContinue: makeOnGoToStep(step + 1),
          };
        };

        return (
          <HakuFormBase
            getStepCollapseProps={getStepCollapseProps}
            {...props}
          />
        );
      }}
    </FormStepper>
  ) : (
    <HakuFormBase {...props} />
  );
};

export default HakuForm;
