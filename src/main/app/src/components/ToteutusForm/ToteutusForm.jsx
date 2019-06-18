import React from 'react';

import FormCollapse from '../FormCollapse';
import KieliversiotFields from '../KieliversiotFields';
import OsaamisalatSection from './OsaamisalatSection';
import NimiSection from './NimiSection';
import PohjaSection from './PohjaSection';
import JarjestamispaikatSection from './JarjestamispaikatSection';
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
import YhteyshenkilotSection from './YhteyshenkilotSection';
import isKorkeakouluKoulutustyyppi from '../../utils/isKorkeakouluKoulutustyyppi';
import isAmmatillinenKoulutustyyppi from '../../utils/isAmmatillinenKoulutustyyppi';
import { KOULUTUSTYYPPI } from '../../constants';
import useFieldValue from '../useFieldValue';

const hakukohteetModal = props => <HakukohteetModal {...props} />;

const ToteutusForm = ({
  koulutusKoodiUri,
  organisaatioOid,
  onMaybeCopy = () => {},
  onCreateNew = () => {},
  steps = false,
  canCopy = true,
  scrollTarget,
  toteutus,
  onAttachHakukohde,
  koulutustyyppi = KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
}) => {
  const isKorkeakoulu = isKorkeakouluKoulutustyyppi(koulutustyyppi);
  const { t } = useTranslation();
  const kieliversiot = useFieldValue('kieliversiot');
  const languages = kieliversiot || [];

  return (
    <FormCollapseGroup
      enabled={steps}
      scrollTarget={scrollTarget}
      defaultOpen={!steps}
    >
      {canCopy ? (
        <FormCollapse
          header={t('yleiset.pohjanValinta')}
          onContinue={onMaybeCopy}
          scrollOnActive={false}
          {...getTestIdProps('pohjaSection')}
        >
          {({ onContinue }) => (
            <PohjaSection
              organisaatioOid={organisaatioOid}
              onCreateNew={onCreateNew}
              onContinue={onContinue}
              name="pohja"
            />
          )}
        </FormCollapse>
      ) : null}

      <FormCollapse
        header={t('yleiset.kieliversiot')}
        {...getTestIdProps('kieliversiotSection')}
      >
        <KieliversiotFields name="kieliversiot" />
      </FormCollapse>

      {isKorkeakoulu ? (
        <FormCollapse
          header={t('toteutuslomake.koulutuksenToteutuksenKuvaus')}
          languages={languages}
          {...getTestIdProps('kuvausSection')}
        >
          <KuvausSection name="kuvaus" />
        </FormCollapse>
      ) : null}

      {isKorkeakoulu ? (
        <FormCollapse
          header={t(
            'toteutuslomake.alemmanKorkeakoulututkinnonErikoistumisalanKuvaus',
          )}
          languages={languages}
          {...getTestIdProps('alempiOsaamisalatSection')}
        >
          <KorkeakouluOsaamisalatSection name="alemmanKorkeakoulututkinnonOsaamisalat" />
        </FormCollapse>
      ) : null}

      {isKorkeakoulu ? (
        <FormCollapse
          header={t(
            'toteutuslomake.ylemmanKorkeakoulututkinnonErikoistumisalanKuvaus',
          )}
          languages={languages}
          {...getTestIdProps('ylempiOsaamisalatSection')}
        >
          <KorkeakouluOsaamisalatSection name="ylemmanKorkeakoulututkinnonOsaamisalat" />
        </FormCollapse>
      ) : null}

      {isAmmatillinenKoulutustyyppi(koulutustyyppi) ? (
        <FormCollapse
          header={t('toteutuslomake.valitseOsaamisalat')}
          languages={languages}
          {...getTestIdProps('osaamisalatSection')}
        >
          <OsaamisalatSection
            name="osaamisalat"
            koulutusKoodiUri={koulutusKoodiUri}
          />
        </FormCollapse>
      ) : null}

      <FormCollapse
        header={t('toteutuslomake.toteutuksenJarjestamistiedot')}
        languages={languages}
        {...getTestIdProps('jarjestamistiedotSection')}
      >
        <JarjestamisTiedotSection
          name="jarjestamistiedot"
          koulutustyyppi={koulutustyyppi}
        />
      </FormCollapse>

      <FormCollapse
        header={t('toteutuslomake.koulutuksenNayttamiseenLiittyvatTiedot')}
        languages={languages}
        {...getTestIdProps('nayttamistiedotSection')}
      >
        <NayttamisTiedotSection name="nayttamistiedot" />
      </FormCollapse>

      <FormCollapse
        header={t('toteutuslomake.toteutuksenJarjestaja')}
        languages={languages}
        {...getTestIdProps('jarjestamispaikatSection')}
      >
        <JarjestamispaikatSection
          name="jarjestamispaikat"
          organisaatioOid={organisaatioOid}
        />
      </FormCollapse>

      <FormCollapse
        header={t('toteutuslomake.toteutuksenNimi')}
        languages={languages}
        {...getTestIdProps('nimiSection')}
      >
        <NimiSection name="nimi" />
      </FormCollapse>

      <FormCollapse
        header={t('toteutuslomake.koulutuksenYhteystiedot')}
        languages={languages}
        {...getTestIdProps('yhteystiedotSection')}
      >
        <YhteyshenkilotSection name="yhteyshenkilot" />
      </FormCollapse>

      {isFunction(onAttachHakukohde) ? (
        <FormCollapse
          header={t('toteutuslomake.toteutukseenLiitetytHakukohteet')}
          id="toteutukseen-liitetetyt-hakukohteet"
          clearable={false}
          actions={
            <ModalController
              modal={hakukohteetModal}
              fieldName="hakukohteet"
              organisaatioOid={organisaatioOid}
              onSave={onAttachHakukohde}
            >
              {({ onToggle }) => (
                <Flex justifyCenter full>
                  <Button onClick={onToggle} type="button">
                    {t('yleiset.liitaHakukohde')}
                  </Button>
                </Flex>
              )}
            </ModalController>
          }
        >
          <HakukohteetSection toteutus={toteutus} />
        </FormCollapse>
      ) : null}
    </FormCollapseGroup>
  );
};

export default ToteutusForm;
