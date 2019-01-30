import React from 'react';
import { formValues } from 'redux-form';

import TypeSection from './TypeSection';
import BaseSelectionSection from './BaseSelectionSection';
import LanguageSection from './LanguageSection';
import InformationSection from './InformationSection';
import DescriptionSection from './DescriptionSection';
import OrganizationSection from './OrganizationSection';
import { isObject } from '../../utils';
import FormCollapseGroup from '../FormCollapseGroup';
import FormCollapse from '../FormCollapse';

const LANGUAGES = [
  { label: 'Suomeksi', value: 'fi' },
  { label: 'Ruotsiksi', value: 'sv' },
  { label: 'Englanniksi', value: 'en' },
];

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

const KoulutusForm = ({ handleSubmit, organisaatioOid, steps = false }) => (
  <form onSubmit={handleSubmit}>
    <ActiveLanguages>
      {({ languages }) => (
        <ActiveKoulutus>
          {({ koulutus }) => (
            <ActiveKoulutusTyyppi>
              {({ koulutusTyyppi }) => (
                <FormCollapseGroup enabled={steps}>
                  <FormCollapse header="1 Koulutustyyppi" section="type">
                    <TypeSection />
                  </FormCollapse>

                  <FormCollapse header="2 Pohjan valinta" section="base">
                    {({ onContinue }) => (
                      <BaseSelectionSection onContinue={onContinue} />
                    )}
                  </FormCollapse>

                  <FormCollapse header="3 Kieliversiot" section="language">
                    <LanguageSection />
                  </FormCollapse>

                  <FormCollapse
                    header="4 Koulutuksen tiedot"
                    section="information"
                  >
                    <InformationSection
                      languages={languages}
                      koulutusTyyppi={koulutusTyyppi}
                    />
                  </FormCollapse>

                  <FormCollapse
                    header="5 Valitun koulutuksen kuvaus"
                    section="description"
                  >
                    <DescriptionSection
                      languages={languages}
                      koodiUri={koulutus ? koulutus.value : null}
                    />
                  </FormCollapse>

                  <FormCollapse
                    header="6 Koulutuksen järjestävä organisaatio"
                    section="organization"
                  >
                    <OrganizationSection organisaatioOid={organisaatioOid} />
                  </FormCollapse>
                </FormCollapseGroup>
              )}
            </ActiveKoulutusTyyppi>
          )}
        </ActiveKoulutus>
      )}
    </ActiveLanguages>
  </form>
);

export default KoulutusForm;
