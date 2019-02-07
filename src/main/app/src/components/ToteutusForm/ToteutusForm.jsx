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
  onCopy = () => {},
  steps = false,
}) => (
  <form onSubmit={handleSubmit}>
    <ActiveLanguages>
      {({ languages }) => (
        <FormCollapseGroup enabled={steps}>
          <FormCollapse header="1 Pohjan valinta" section="base">
            {({ onContinue }) => (
              <PohjaSection organisaatioOid={organisaatioOid} onCopy={onCopy} onContinue={onContinue} />
            )}
          </FormCollapse>

          <FormCollapse header="2 Kieliversiot" section="kieliversiot">
            <KieliversiotFormSection />
          </FormCollapse>

          <FormCollapse header="3 Valitse osaamisalat" section="osaamisalat">
            <OsaamisalatSection
              languages={languages}
              koulutusKoodiUri={koulutusKoodiUri}
            />
          </FormCollapse>

          <FormCollapse
            header="4 Toteutuksen järjestämistiedot"
            section="jarjestamistiedot"
          >
            <JarjestamisTiedotSection languages={languages} />
          </FormCollapse>

          <FormCollapse
            header="5 Koulutuksen näyttämiseen liittyvät tiedot"
            section="nayttamistiedot"
          >
            <NayttamisTiedotSection languages={languages} />
          </FormCollapse>

          <FormCollapse
            header="6 Missä järjestetään?"
            section="jarjestamispaikat"
          >
            <JarjestamisPaikatSection organisaatioOid={organisaatioOid} />
          </FormCollapse>

          <FormCollapse header="7 Toteutuksen nimi" section="nimi">
            <NimiSection languages={languages} />
          </FormCollapse>

          <FormCollapse
            header="8 Koulutuksen yhteystiedot"
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
