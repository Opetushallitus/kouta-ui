import React from 'react';
import { formValues } from 'redux-form';

import TypeSection from './TypeSection';
import BaseSelectionSection from './BaseSelectionSection';
import InformationSection from './InformationSection';
import DescriptionSection from './DescriptionSection';
import OrganizationSection from './OrganizationSection';
import FormCollapseGroup from '../FormCollapseGroup';
import FormCollapse from '../FormCollapse';
import KieliversiotFormSection from '../KieliversiotFormSection';
import { LANGUAGE_TABS } from '../../constants';

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

const ActiveKoulutusTyyppi = formValues({
  koulutusTyyppi: 'type.type',
})(({ koulutusTyyppi, children }) => children({ koulutusTyyppi }));

const ActiveKoulutus = formValues({
  koulutus: 'information.koulutus',
})(({ koulutus, children }) => children({ koulutus }));

const KoulutusForm = ({
  handleSubmit,
  organisaatioOid,
  onCopy = () => {},
  onMaybeCopy = () => {},
  steps = false,
}) => (
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

                  <FormCollapse header="2 Pohjan valinta" section="base" onContinue={onMaybeCopy}>
                    {({ onContinue }) => (
                      <BaseSelectionSection
                        onContinue={onContinue}
                        organisaatioOid={organisaatioOid}
                        onCopy={onCopy}
                      />
                    )}
                  </FormCollapse>

                  <FormCollapse header="3 Kieliversiot" section="kieliversiot">
                    <KieliversiotFormSection />
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
