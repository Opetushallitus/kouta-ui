import React from 'react';
import { formValues } from 'redux-form';

import FormStepper from '../FormStepper';
import { isObject } from '../../utils';
import FormCollapse from '../FormCollapse';
import { LANGUAGE_TABS } from '../../constants';
import OsaamisalatSection from './OsaamisalatSection';
import YhteystiedotSection from './YhteystiedotSection';
import NimiSection from './NimiSection';
import PohjaSection from './PohjaSection';

const ActiveLanguages = formValues({
  language: 'language',
})(({ language, ...props }) => {
  const activeLanguages = isObject(language)
    ? Object.keys(language).filter(key => !!language[key])
    : [];

  return props.children({
    languages: LANGUAGE_TABS.filter(({ value }) =>
      activeLanguages.includes(value),
    ),
  });
});

const defaultGetStepCollapseProps = () => ({
  open: true,
});

const ToteutusFormBase = ({
  handleSubmit,
  getStepCollapseProps = defaultGetStepCollapseProps,
  koulutusKoodiUri,
}) => (
  <form onSubmit={handleSubmit}>
    <ActiveLanguages>
      {({ languages }) => (
        <>
          <FormCollapse
            header="1 Pohjan valinta"
            section="base"
            {...getStepCollapseProps(0)}
          >
            <PohjaSection />
          </FormCollapse>

          <FormCollapse
            header="2 Valitse osaamisalat"
            section="osaamisalat"
            {...getStepCollapseProps(1)}
          >
            <OsaamisalatSection
              languages={LANGUAGE_TABS}
              koulutusKoodiUri={koulutusKoodiUri}
            />
          </FormCollapse>

          <FormCollapse
            header="3 Toteutuksen järjestämistiedot"
            section="jarjestamistiedot"
            {...getStepCollapseProps(2)}
          >
            <div />
          </FormCollapse>

          <FormCollapse
            header="4 Koulutuksen näyttämiseen liittyvät tiedot"
            section="nayttamistiedot"
            {...getStepCollapseProps(3)}
          >
            <div />
          </FormCollapse>

          <FormCollapse
            header="5 Missä järjestetään?"
            section="jarjestamispaikat"
            {...getStepCollapseProps(4)}
          >
            <div />
          </FormCollapse>

          <FormCollapse
            header="6 Toteutuksen nimi"
            section="nimi"
            {...getStepCollapseProps(5)}
          >
            <NimiSection languages={LANGUAGE_TABS} />
          </FormCollapse>

          <FormCollapse
            header="7 Koulutuksen yhteystiedot"
            section="yhteystiedot"
            {...getStepCollapseProps(6)}
          >
            <YhteystiedotSection languages={LANGUAGE_TABS} />
          </FormCollapse>
        </>
      )}
    </ActiveLanguages>
  </form>
);

const ToteutusForm = ({ steps = false, ...props }) => {
  return steps ? (
    <FormStepper stepCount={8}>
      {({ activeStep, makeOnGoToStep }) => {
        const getStepCollapseProps = step => {
          return {
            open: activeStep >= step,
            onContinue: makeOnGoToStep(step + 1),
          };
        };

        return (
          <ToteutusFormBase
            getStepCollapseProps={getStepCollapseProps}
            {...props}
          />
        );
      }}
    </FormStepper>
  ) : (
    <ToteutusFormBase {...props} />
  );
};

export default ToteutusForm;
