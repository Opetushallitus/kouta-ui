import React from 'react';
import { formValues } from 'redux-form';

import FormCollapse from '../FormCollapse';
import KieliversiotFormSection from '../KieliversiotFormSection';
import { LANGUAGE_TABS } from '../../constants';
import FormCollapseGroup from '../FormCollapseGroup';
import KohdejoukonRajausSection from './KohdejoukonRajausSection';
import HakutavanRajausSection from './HakutavanRajausSection';
import NimiSection from './NimiSection';
import ValintatapaSection from './ValintatapaSection';
import PohjaSection from './PohjaSection';
import KielitaitovaatimuksetSection from './KielitaitovaatimuksetSection';

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

const ValintaperusteetForm = ({
  handleSubmit,
  steps = true,
}) => (
  <form onSubmit={handleSubmit}>
    <ActiveLanguages>
      {({ languages }) => (
        <FormCollapseGroup enabled={steps}>
          <FormCollapse
            header="Kieliversiot"
            section="kieliversiot"
          >
            <KieliversiotFormSection />
          </FormCollapse>

          <FormCollapse
            header="Valitse pohja"
            section="pohja"
          >
            {({ onContinue }) => (
              <PohjaSection onContinue={onContinue} />
            )}
          </FormCollapse>

          <FormCollapse
            header="Hakutavan rajaus"
            section="hakutavanRajaus"
          >
            <HakutavanRajausSection />
          </FormCollapse>

          <FormCollapse
            header="Haun kohdejoukon rajaus"
            section="kohdejoukonRajaus"
          >
            <KohdejoukonRajausSection />
          </FormCollapse>

          <FormCollapse
            header="Valintaperusteen nimi"
            section="nimi"
          >
            <NimiSection languages={languages} />
          </FormCollapse>

          <FormCollapse
            header="Valintatapa"
            section="valintatapa"
          >
            <ValintatapaSection languages={languages} />
          </FormCollapse>

          <FormCollapse
            header="Kielitaitovaatimukset"
            section="kielitaitovaatimukset"
          >
            <KielitaitovaatimuksetSection languages={languages} />
          </FormCollapse>
        </FormCollapseGroup>
      )}
    </ActiveLanguages>
  </form>
);

export default ValintaperusteetForm;
