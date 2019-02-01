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
import SorakuvausSection from './SorakuvausSection';
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
            header="1 Kieliversiot"
            section="kieliversiot"
          >
            <KieliversiotFormSection />
          </FormCollapse>

          <FormCollapse
            header="2 Valitse pohja"
            section="pohja"
          >
            {({ onContinue }) => (
              <PohjaSection onContinue={onContinue} />
            )}
          </FormCollapse>

          <FormCollapse
            header="3 Hakutavan rajaus"
            section="hakutavanRajaus"
          >
            <HakutavanRajausSection />
          </FormCollapse>

          <FormCollapse
            header="4 Haun kohdejoukon rajaus"
            section="kohdejoukonRajaus"
          >
            <KohdejoukonRajausSection />
          </FormCollapse>

          <FormCollapse
            header="5 Valintaperusteen nimi"
            section="nimi"
          >
            <NimiSection languages={languages} />
          </FormCollapse>

          <FormCollapse
            header="6 Valintatapa"
            section="valintapa"
          >
            <ValintatapaSection languages={languages} />
          </FormCollapse>

          <FormCollapse
            header="7 Kielitaitovaatimukset"
            section="kielitaitovaatimukset"
          >
            <KielitaitovaatimuksetSection languages={languages} />
          </FormCollapse>

          <FormCollapse
            header="8 Sora-kuvaus"
            section="sorakuvaus"
          >
            <SorakuvausSection />
          </FormCollapse>
        </FormCollapseGroup>
      )}
    </ActiveLanguages>
  </form>
);

export default ValintaperusteetForm;
