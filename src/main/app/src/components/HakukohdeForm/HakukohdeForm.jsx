import React from 'react';
import { formValues } from 'redux-form';

import FormCollapse from '../FormCollapse';
import KieliversiotFormSection from '../KieliversiotFormSection';
import { LANGUAGE_TABS } from '../../constants';
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
  const activeLanguages = languages || [];

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
            header="2 Pohjakoulutusvaatimus"
            section="pohjakoulutus"
          >
            <PohjakoulutusSection languages={languages} />
          </FormCollapse>

          <FormCollapse
            header="3 Hakukohteen perustiedot"
            section="perustiedot"
          >
            <PerustiedotSection languages={languages} />
          </FormCollapse>

          <FormCollapse
            header="4 Hakuajat"
            section="hakuajat"
          >
            <HakuajatSection haku={haku} languages={languages} />
          </FormCollapse>

          <FormCollapse
            header="5 Lomake"
            section="lomake"
          >
            <LomakeSection />
          </FormCollapse>

          <FormCollapse
            header="6 Koulutuksen alkamiskausi"
            section="alkamiskausi"
          >
            <AlkamiskausiSection />
          </FormCollapse>

          <FormCollapse
            header="7 Aloituspaikat"
            section="aloituspaikat"
          >
            <AloituspaikatSection />
          </FormCollapse>

          <FormCollapse
            header="8 Valintaperusteen kuvaus"
            section="valintaperusteenKuvaus"
          >
            <KuvausSection organisaatio={organisaatio} haku={haku} />
          </FormCollapse>

          <FormCollapse
            header="9 Valintakoe"
            section="valintakoe"
          >
            <ValintakoeSection languages={languages} />
          </FormCollapse>

          <FormCollapse
            header="10 Tarvittavat liitteet"
            section="liitteet"
          >
            <LiitteetSection languages={languages} organisaatioOid={organisaatioOid} />
          </FormCollapse>
        </FormCollapseGroup>
      )}
    </ActiveLanguages>
  </form>
);

export default HakukohdeForm;
