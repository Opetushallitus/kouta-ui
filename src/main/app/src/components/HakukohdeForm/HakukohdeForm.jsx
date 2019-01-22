import React from 'react';
import { formValues } from 'redux-form';

import FormStepper from '../FormStepper';
import FormCollapse from '../FormCollapse';
import KieliversiotFormSection from '../KieliversiotFormSection';
import { LANGUAGE_TABS } from '../../constants';
import PohjakoulutusSection from './PohjakoulutusSection';

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

const defaultGetStepCollapseProps = () => ({
  open: true,
});

const HakukohdeFormBase = ({
  handleSubmit,
  getStepCollapseProps = defaultGetStepCollapseProps,
}) => (
  <form onSubmit={handleSubmit}>
    <ActiveLanguages>
      {({ languages }) => (
        <>
          <FormCollapse
            header="1 Kieliversiot"
            section="kieliversiot"
            {...getStepCollapseProps(0)}
          >
            <KieliversiotFormSection />
          </FormCollapse>

          <FormCollapse
            header="2 Pohjakoulutusvaatimus"
            section="pohjakoulutus"
            {...getStepCollapseProps(1)}
          >
            <PohjakoulutusSection languages={languages} />
          </FormCollapse>

          <FormCollapse
            header="3 Hakukohteen perustiedot"
            section="perustiedot"
            {...getStepCollapseProps(2)}
          >
            <div />
          </FormCollapse>

          <FormCollapse
            header="4 Hakuajat"
            section="hakuajat"
            {...getStepCollapseProps(3)}
          >
            <div />
          </FormCollapse>

          <FormCollapse
            header="5 Lomake"
            section="lomake"
            {...getStepCollapseProps(4)}
          >
            <div />
          </FormCollapse>

          <FormCollapse
            header="6 Koulutuksen alkamiskausi"
            section="alkamiskausi"
            {...getStepCollapseProps(5)}
          >
            <div />
          </FormCollapse>

          <FormCollapse
            header="7 Aloituspaikat"
            section="aloituspaikat"
            {...getStepCollapseProps(6)}
          >
            <div />
          </FormCollapse>

          <FormCollapse
            header="8 Valintaperusteen kuvaus"
            section="valintaperusteenKuvaus"
            {...getStepCollapseProps(7)}
          >
            <div />
          </FormCollapse>

          <FormCollapse
            header="9 Valintakoe"
            section="valintakoe"
            {...getStepCollapseProps(8)}
            onContinue={null}
          >
            <div />
          </FormCollapse>

          <FormCollapse
            header="10 Tarvittavat liitteet"
            section="liitteet"
            {...getStepCollapseProps(9)}
            onContinue={null}
          >
            <div />
          </FormCollapse>
        </>
      )}
    </ActiveLanguages>
  </form>
);

const HakukohdeForm = ({ steps = false, ...props }) => {
  const stepCount = 8;

  return steps ? (
    <FormStepper stepCount={stepCount}>
      {({ activeStep, makeOnGoToStep }) => {
        const getStepCollapseProps = step => {
          return {
            open: activeStep >= step,
            onContinue: makeOnGoToStep(step + 1),
          };
        };

        return (
          <HakukohdeFormBase
            getStepCollapseProps={getStepCollapseProps}
            {...props}
          />
        );
      }}
    </FormStepper>
  ) : (
    <HakukohdeFormBase {...props} />
  );
};

export default HakukohdeForm;
