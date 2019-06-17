import React from 'react';
import { formValues } from 'redux-form';

import FormCollapse from '../FormCollapse';
import KieliversiotFields from '../KieliversiotFields';
import { KOULUTUSTYYPPI } from '../../constants';
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
  languages: 'kieliversiot',
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
  koulutustyyppi = KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
}) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={handleSubmit}>
      <ActiveLanguages>
        {({ languages }) => (
          <FormCollapseGroup enabled={steps} defaultOpen={!steps}>
            <FormCollapse
              header={t('yleiset.kieliversiot')}
              scrollOnActive={false}
              {...getTestIdProps('kieliversiotSection')}
            >
              <KieliversiotFields name="kieliversiot" />
            </FormCollapse>

            <FormCollapse
              header={t('hakukohdelomake.pohjakoulutusvaatimus')}
              {...getTestIdProps('pohjakoulutusvaatimusSection')}
            >
              <PohjakoulutusSection
                name="pohjakoulutus"
                koulutustyyppi={koulutustyyppi}
              />
            </FormCollapse>

            <FormCollapse
              header={t('hakukohdelomake.hakukohteenPerustiedot')}
              languages={languages}
              {...getTestIdProps('perustiedotSection')}
            >
              <PerustiedotSection
                name="perustiedot"
                koulutustyyppi={koulutustyyppi}
              />
            </FormCollapse>

            <FormCollapse
              header={t('hakukohdelomake.hakuajat')}
              {...getTestIdProps('hakuajatSection')}
            >
              <HakuajatSection name="hakuajat" haku={haku} />
            </FormCollapse>

            <FormCollapse
              header={t('yleiset.hakulomakkeenValinta')}
              {...getTestIdProps('lomakeSection')}
              languages={languages}
            >
              <LomakeSection />
            </FormCollapse>

            <FormCollapse
              header={t('hakukohdelomake.koulutuksenAlkamiskausi')}
              {...getTestIdProps('alkamiskausiSection')}
            >
              <AlkamiskausiSection name="alkamiskausi" />
            </FormCollapse>

            <FormCollapse
              header={t('hakukohdelomake.aloituspaikat')}
              {...getTestIdProps('aloituspaikatSection')}
            >
              <AloituspaikatSection
                name="aloituspaikat"
                koulutustyyppi={koulutustyyppi}
              />
            </FormCollapse>

            <FormCollapse
              header={t('hakukohdelomake.valintaperusteenKuvaus')}
              {...getTestIdProps('valintaperusteenKuvausSection')}
            >
              <KuvausSection
                organisaatio={organisaatio}
                name="valintaperusteenKuvaus"
                haku={haku}
              />
            </FormCollapse>

            <FormCollapse
              header={t('hakukohdelomake.valintakoe')}
              languages={languages}
              {...getTestIdProps('valintakoeSection')}
            >
              <ValintakoeSection name="valintakoe" />
            </FormCollapse>

            <FormCollapse
              header={t('hakukohdelomake.tarvittavatLiitteet')}
              languages={languages}
              {...getTestIdProps('liitteetSection')}
            >
              <LiitteetSection
                name="liitteet"
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
