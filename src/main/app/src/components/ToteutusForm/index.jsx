import React from 'react';
import { formValues } from 'redux-form';

import FormStepper from '../FormStepper';
import { isObject } from '../../utils';
import FormCollapse from '../FormCollapse';
import KieliversiotFormSection from '../KieliversiotFormSection';
import { LANGUAGE_TABS } from '../../constants';
import OsaamisalatSection from './OsaamisalatSection';
import YhteystiedotSection from './YhteystiedotSection';
import NimiSection from './NimiSection';
import PohjaSection from './PohjaSection';
import JarjestamisPaikatSection from './JarjestamisPaikatSection';
import JarjestamisTiedotSection from './JarjestamisTiedotSection';

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

const ToteutusFormBase = ({
  handleSubmit,
  getStepCollapseProps = defaultGetStepCollapseProps,
  koulutusKoodiUri,
  organisaatioOid,
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
            header="2 Kieliversiot"
            section="kieliversiot"
            {...getStepCollapseProps(1)}
          >
            <KieliversiotFormSection />
          </FormCollapse>

          <FormCollapse
            header="3 Valitse osaamisalat"
            section="osaamisalat"
            {...getStepCollapseProps(2)}
          >
            <OsaamisalatSection
              languages={languages}
              koulutusKoodiUri={koulutusKoodiUri}
            />
          </FormCollapse>

          <FormCollapse
            header="4 Toteutuksen järjestämistiedot"
            section="jarjestamistiedot"
            {...getStepCollapseProps(3)}
          >
            <JarjestamisTiedotSection languages={languages} />
          </FormCollapse>

          <FormCollapse
            header="5 Koulutuksen näyttämiseen liittyvät tiedot"
            section="nayttamistiedot"
            {...getStepCollapseProps(4)}
          >
            <div />
          </FormCollapse>

          <FormCollapse
            header="6 Missä järjestetään?"
            section="jarjestamispaikat"
            {...getStepCollapseProps(5)}
          >
            <JarjestamisPaikatSection organisaatioOid={organisaatioOid} />
          </FormCollapse>

          <FormCollapse
            header="7 Toteutuksen nimi"
            section="nimi"
            {...getStepCollapseProps(6)}
          >
            <NimiSection languages={languages} />
          </FormCollapse>

          <FormCollapse
            header="8 Koulutuksen yhteystiedot"
            section="yhteystiedot"
            {...getStepCollapseProps(7)}
            onContinue={null}
          >
            <YhteystiedotSection languages={languages} />
          </FormCollapse>
        </>
      )}
    </ActiveLanguages>
  </form>
);

const ToteutusForm = ({ steps = false, ...props }) => {
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
