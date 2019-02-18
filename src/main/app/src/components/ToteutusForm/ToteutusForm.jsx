import React from 'react';
import { formValues } from 'redux-form';

import FormCollapse from '../FormCollapse';
import KieliversiotFormSection from '../KieliversiotFormSection';
import { LANGUAGE_TABS } from '../../constants';
import OsaamisalatSection from './OsaamisalatSection';
import YhteystiedotSection from './YhteystiedotSection';
import NimiSection from './NimiSection';
import PohjaSection from './PohjaSection';
import JarjestamisPaikatSection from './JarjestamisPaikatSection';
import JarjestamisTiedotSection from './JarjestamisTiedotSection';
import NayttamisTiedotSection from './NayttamisTiedotSection';
import FormCollapseGroup from '../FormCollapseGroup';

const ActiveLanguages = formValues({
  languages: 'kieliversiot.languages',
})(({ languages, ...props }) => {
  const activeLanguages = languages || [];

  return props.children({
    languages: LANGUAGE_TABS.filter(({ value }) =>
      activeLanguages.includes(value),
    ),
  });
});

const ToteutusForm = ({
  handleSubmit,
  koulutusKoodiUri,
  organisaatioOid,
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
            section="base"
            onContinue={onMaybeCopy}
          >
            {({ onContinue }) => (
              <PohjaSection
                organisaatioOid={organisaatioOid}
                onCreateNew={onCreateNew}
                onContinue={onContinue}
              />
            )}
          </FormCollapse>

          <FormCollapse header="Kieliversiot" section="kieliversiot">
            <KieliversiotFormSection />
          </FormCollapse>

          <FormCollapse header="Valitse osaamisalat" section="osaamisalat">
            <OsaamisalatSection
              languages={languages}
              koulutusKoodiUri={koulutusKoodiUri}
            />
          </FormCollapse>

          <FormCollapse
            header="Toteutuksen järjestämistiedot"
            section="jarjestamistiedot"
          >
            <JarjestamisTiedotSection languages={languages} />
          </FormCollapse>

          <FormCollapse
            header="Koulutuksen näyttämiseen liittyvät tiedot"
            section="nayttamistiedot"
          >
            <NayttamisTiedotSection languages={languages} />
          </FormCollapse>

          <FormCollapse
            header="Missä järjestetään?"
            section="jarjestamispaikat"
          >
            <JarjestamisPaikatSection organisaatioOid={organisaatioOid} />
          </FormCollapse>

          <FormCollapse header="Toteutuksen nimi" section="nimi">
            <NimiSection languages={languages} />
          </FormCollapse>

          <FormCollapse
            header="Koulutuksen yhteystiedot"
            section="yhteystiedot"
          >
            <YhteystiedotSection languages={languages} />
          </FormCollapse>
        </FormCollapseGroup>
      )}
    </ActiveLanguages>
  </form>
);

export default ToteutusForm;
