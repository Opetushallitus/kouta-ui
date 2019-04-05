import React from 'react';
import { formValues } from 'redux-form';

import FormCollapse from '../FormCollapse';
import KieliversiotFormSection from '../KieliversiotFormSection';

import { KOULUTUSTYYPPI_CATEGORY } from '../../constants';
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
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';

const ActiveLanguages = formValues({
  languages: 'kieliversiot.languages',
})(({ languages, ...props }) => {
  return props.children({
    languages: languages || [],
  });
});

const HakukohdeForm = ({
  handleSubmit,
  steps = true,
  organisaatioOid,
  organisaatio,
  haku,
  koulutustyyppi = KOULUTUSTYYPPI_CATEGORY.AMMATILLINEN_KOULUTUS,
}) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={handleSubmit}>
      <ActiveLanguages>
        {({ languages }) => (
          <FormCollapseGroup enabled={steps}>
            <FormCollapse
              header={t('yleiset.kieliversiot')}
              section="kieliversiot"
              {...getTestIdProps('kieliversiotSection')}
            >
              <KieliversiotFormSection />
            </FormCollapse>

            <FormCollapse
              header={t('hakukohdelomake.pohjakoulutusvaatimus')}
              section="pohjakoulutus"
              {...getTestIdProps('pohjakoulutusvaatimusSection')}
            >
              <PohjakoulutusSection
                languages={languages}
                koulutustyyppi={koulutustyyppi}
              />
            </FormCollapse>

            <FormCollapse
              header={t('hakukohdelomake.hakukohteenPerustiedot')}
              section="perustiedot"
              {...getTestIdProps('perustiedotSection')}
            >
              <PerustiedotSection
                languages={languages}
                koulutustyyppi={koulutustyyppi}
              />
            </FormCollapse>

            <FormCollapse
              header={t('hakukohdelomake.hakuajat')}
              section="hakuajat"
              {...getTestIdProps('hakuajatSection')}
            >
              <HakuajatSection haku={haku} languages={languages} />
            </FormCollapse>

            <FormCollapse
              header="Lomake"
              section="lomake"
              {...getTestIdProps('lomakeSection')}
            >
              <LomakeSection />
            </FormCollapse>

            <FormCollapse
              header={t('hakukohdelomake.koulutuksenAlkamiskausi')}
              section="alkamiskausi"
              {...getTestIdProps('alkamiskausiSection')}
            >
              <AlkamiskausiSection />
            </FormCollapse>

            <FormCollapse
              header={t('hakukohdelomake.aloituspaikat')}
              section="aloituspaikat"
              {...getTestIdProps('aloituspaikatSection')}
            >
              <AloituspaikatSection koulutustyyppi={koulutustyyppi} />
            </FormCollapse>

            <FormCollapse
              header={t('hakukohdelomake.valintaperusteenKuvaus')}
              section="valintaperusteenKuvaus"
              {...getTestIdProps('valintaperusteenKuvausSection')}
            >
              <KuvausSection organisaatio={organisaatio} haku={haku} />
            </FormCollapse>

            <FormCollapse
              header={t('hakukohdelomake.valintakoe')}
              section="valintakoe"
              {...getTestIdProps('valintakoeSection')}
            >
              <ValintakoeSection languages={languages} />
            </FormCollapse>

            <FormCollapse
              header={t('hakukohdelomake.tarvittavatLiitteet')}
              section="liitteet"
              {...getTestIdProps('liitteetSection')}
            >
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
};

export default HakukohdeForm;
