import React from 'react';
import { formValues } from 'redux-form';

import FormCollapse from '../FormCollapse';
import KieliversiotFormSection from '../KieliversiotFormSection';
import OsaamisalatSection from './OsaamisalatSection';
import YhteystiedotSection from './YhteystiedotSection';
import NimiSection from './NimiSection';
import PohjaSection from './PohjaSection';
import JarjestamisPaikatSection from './JarjestamisPaikatSection';
import JarjestamisTiedotSection from './JarjestamisTiedotSection';
import NayttamisTiedotSection from './NayttamisTiedotSection';
import FormCollapseGroup from '../FormCollapseGroup';
import HakukohteetSection from './HakukohteetSection';
import { isFunction, getTestIdProps } from '../../utils';
import HakukohteetModal from './HakukohteetModal';
import { ModalController } from '../Modal';
import Flex from '../Flex';
import Button from '../Button';
import KorkeakouluOsaamisalatSection from './KorkeakouluOsaamisalatSection';
import KuvausSection from './KuvausSection';
import useTranslation from '../useTranslation';

import {
  KORKEAKOULUKOULUTUSTYYPIT,
  KOULUTUSTYYPPI_CATEGORY,
} from '../../constants';

const ActiveLanguages = formValues({
  languages: 'kieliversiot.languages',
})(({ languages, ...props }) => {
  return props.children({
    languages: languages || [],
  });
});

const HakukohteetPohjaAndHakuFieldValue = formValues({
  pohja: 'hakukohteet.pohja',
  haku: 'hakukohteet.haku',
})(({ pohja, haku, children }) => children({ pohja, haku }));

const hakukohteetModal = props => <HakukohteetModal {...props} />;

const ToteutusForm = ({
  handleSubmit,
  koulutusKoodiUri,
  organisaatioOid,
  onMaybeCopy = () => {},
  onCreateNew = () => {},
  steps = false,
  canCopy = true,
  scrollTarget,
  toteutus,
  onAttachHakukohde,
  koulutustyyppi = KOULUTUSTYYPPI_CATEGORY.AMMATILLINEN_KOULUTUS,
}) => {
  const isKorkeakoulu = KORKEAKOULUKOULUTUSTYYPIT.includes(koulutustyyppi);
  const { t } = useTranslation();

  return (
    <form onSubmit={handleSubmit}>
      <ActiveLanguages>
        {({ languages }) => (
          <FormCollapseGroup enabled={steps} scrollTarget={scrollTarget} defaultOpen={!steps}>
            {canCopy ? (
              <FormCollapse
                header={t('yleiset.pohjanValinta')}
                section="base"
                onContinue={onMaybeCopy}
                scrollOnActive={false}
                {...getTestIdProps('pohjaSection')}
              >
                {({ onContinue }) => (
                  <PohjaSection
                    organisaatioOid={organisaatioOid}
                    onCreateNew={onCreateNew}
                    onContinue={onContinue}
                  />
                )}
              </FormCollapse>
            ) : null}

            <FormCollapse
              header={t('yleiset.kieliversiot')}
              section="kieliversiot"
              {...getTestIdProps('kieliversiotSection')}
            >
              <KieliversiotFormSection />
            </FormCollapse>

            {isKorkeakoulu ? (
              <FormCollapse
                header={t('toteutuslomake.koulutuksenToteutuksenKuvaus')}
                section="kuvaus"
                languages={languages}
                {...getTestIdProps('kuvausSection')}
              >
                <KuvausSection />
              </FormCollapse>
            ) : null}

            {isKorkeakoulu ? (
              <FormCollapse
                header={t(
                  'toteutuslomake.alemmanKorkeakoulututkinnonErikoistumisalanKuvaus',
                )}
                section="alemmanKorkeakoulututkinnonOsaamisalat"
                languages={languages}
                {...getTestIdProps('alempiOsaamisalatSection')}
              >
                <KorkeakouluOsaamisalatSection />
              </FormCollapse>
            ) : null}

            {isKorkeakoulu ? (
              <FormCollapse
                header={t(
                  'toteutuslomake.ylemmanKorkeakoulututkinnonErikoistumisalanKuvaus',
                )}
                section="ylemmanKorkeakoulututkinnonOsaamisalat"
                languages={languages}
                {...getTestIdProps('ylempiOsaamisalatSection')}
              >
                <KorkeakouluOsaamisalatSection />
              </FormCollapse>
            ) : null}

            {koulutustyyppi ===
            KOULUTUSTYYPPI_CATEGORY.AMMATILLINEN_KOULUTUS ? (
              <FormCollapse
                header={t('toteutuslomake.valitseOsaamisalat')}
                section="osaamisalat"
                languages={languages}
                {...getTestIdProps('osaamisalatSection')}
              >
                <OsaamisalatSection koulutusKoodiUri={koulutusKoodiUri} />
              </FormCollapse>
            ) : null}

            <FormCollapse
              header={t('toteutuslomake.toteutuksenJarjestamistiedot')}
              section="jarjestamistiedot"
              languages={languages}
              {...getTestIdProps('jarjestamistiedotSection')}
            >
              <JarjestamisTiedotSection koulutustyyppi={koulutustyyppi} />
            </FormCollapse>

            <FormCollapse
              header={t(
                'toteutuslomake.koulutuksenNayttamiseenLiittyvatTiedot',
              )}
              languages={languages}
              section="nayttamistiedot"
              {...getTestIdProps('nayttamistiedotSection')}
            >
              <NayttamisTiedotSection />
            </FormCollapse>

            <FormCollapse
              header={t('toteutuslomake.toteutuksenJarjestaja')}
              section="jarjestamispaikat"
              languages={languages}
              {...getTestIdProps('jarjestajaSection')}
            >
              <JarjestamisPaikatSection organisaatioOid={organisaatioOid} />
            </FormCollapse>

            <FormCollapse
              header={t('toteutuslomake.toteutuksenNimi')}
              section="nimi"
              languages={languages}
              {...getTestIdProps('nimiSection')}
            >
              <NimiSection />
            </FormCollapse>

            <FormCollapse
              header={t('toteutuslomake.koulutuksenYhteystiedot')}
              section="yhteystiedot"
              languages={languages}
              {...getTestIdProps('yhteystiedotSection')}
            >
              <YhteystiedotSection />
            </FormCollapse>

            {isFunction(onAttachHakukohde) ? (
              <FormCollapse
                header={t('toteutuslomake.toteutukseenLiitetytHakukohteet')}
                id="toteutukseen-liitetetyt-hakukohteet"
                clearable={false}
                actions={
                  <HakukohteetPohjaAndHakuFieldValue>
                    {({ pohja, haku }) => (
                      <ModalController
                        modal={hakukohteetModal}
                        pohjaValue={pohja}
                        hakuValue={haku}
                        fieldName="hakukohteet"
                        organisaatioOid={organisaatioOid}
                        onSave={onAttachHakukohde}
                      >
                        {({ onToggle }) => (
                          <Flex justifyEnd full>
                            <Button onClick={onToggle} type="button">
                              {t('yleiset.liitaHakukohde')}
                            </Button>
                          </Flex>
                        )}
                      </ModalController>
                    )}
                  </HakukohteetPohjaAndHakuFieldValue>
                }
              >
                <HakukohteetSection toteutus={toteutus} />
              </FormCollapse>
            ) : null}
          </FormCollapseGroup>
        )}
      </ActiveLanguages>
    </form>
  );
};

export default ToteutusForm;
