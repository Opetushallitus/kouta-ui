import React from 'react';
import { formValues } from 'redux-form';

import FormCollapse from '../FormCollapse';
import KieliversiotFormSection from '../KieliversiotFormSection';

import { LANGUAGE_TABS, KOULUTUSTYYPPI_CATEGORY } from '../../constants';

import PohjakoulutusSection from './PohjakoulutusSection';
import PerustiedotSection from './PerustiedotSection';
import AloituspaikatSection from './AloituspaikatSection';
import HakuajatSection from './HakuajatSection';
import ValintakoeSection from './ValintakoeSection';
import AlkamiskausiSection from './AlkamiskausiSection';
import LiitteetSection from './LiitteetSection';
import FormCollapseGroup from '../FormCollapseGroup';
import LomakeSection from './LomakeSection';
import KuvausSection from './KuvausSection';

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

const HakukohdeForm = ({
  handleSubmit,
  steps = true,
  organisaatioOid,
  organisaatio,
  haku,
  koulutustyyppi = KOULUTUSTYYPPI_CATEGORY.AMMATILLINEN_KOULUTUS,
}) => (
  <form onSubmit={handleSubmit}>
    <ActiveLanguages>
      {({ languages }) => (
        <FormCollapseGroup enabled={steps}>
          <FormCollapse header="Kieliversiot" section="kieliversiot">
            <KieliversiotFormSection />
          </FormCollapse>

          <FormCollapse header="Pohjakoulutusvaatimus" section="pohjakoulutus">
            <PohjakoulutusSection
              languages={languages}
              koulutustyyppi={koulutustyyppi}
            />
          </FormCollapse>

          <FormCollapse header="Hakukohteen perustiedot" section="perustiedot">
            <PerustiedotSection
              languages={languages}
              koulutustyyppi={koulutustyyppi}
            />
          </FormCollapse>

          <FormCollapse header="Hakuajat" section="hakuajat">
            <HakuajatSection haku={haku} languages={languages} />
          </FormCollapse>

          <FormCollapse header="Lomake" section="lomake">
            <LomakeSection />
          </FormCollapse>

          <FormCollapse
            header="Koulutuksen alkamiskausi"
            section="alkamiskausi"
          >
            <AlkamiskausiSection />
          </FormCollapse>

          <FormCollapse header="Aloituspaikat" section="aloituspaikat">
            <AloituspaikatSection koulutustyyppi={koulutustyyppi} />
          </FormCollapse>

          <FormCollapse
            header="Valintaperusteen kuvaus"
            section="valintaperusteenKuvaus"
          >
            <KuvausSection organisaatio={organisaatio} haku={haku} />
          </FormCollapse>

          <FormCollapse header="Valintakoe" section="valintakoe">
            <ValintakoeSection languages={languages} />
          </FormCollapse>

          <FormCollapse header="Tarvittavat liitteet" section="liitteet">
            <LiitteetSection
              languages={languages}
              organisaatioOid={organisaatioOid}
            />
          </FormCollapse>
        </FormCollapseGroup>
      )}
    </ActiveLanguages>
  </form>
);

export default HakukohdeForm;
