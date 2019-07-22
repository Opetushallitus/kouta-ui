import React, { useCallback } from 'react';
import get from 'lodash/get';

import TypeSection from './TypeSection';
import BaseSelectionSection from './BaseSelectionSection';
import TiedotSection from './TiedotSection/TiedotSection';
import KuvausSection from './KuvausSection';
import JarjestajaSection from './JarjestajaSection';
import FormCollapseGroup from '../FormCollapseGroup';
import FormCollapse from '../FormCollapse';
import KieliversiotFields from '../KieliversiotFields';
import ToteutuksetSection from './ToteutuksetSection';
import Button from '../Button';
import { isFunction, getTestIdProps } from '../../utils';
import LisatiedotSection from './LisatiedotSection';
import Flex from '../Flex';
import NakyvyysSection from './NakyvyysSection';
import useTranslation from '../useTranslation';
import isKorkeakouluKoulutustyyppi from '../../utils/isKorkeakouluKoulutustyyppi';
import useFieldValue from '../useFieldValue';

const PohjaFormCollapse = ({ children, onSelectBase, ...props }) => {
  const tapa = useFieldValue('pohja.tapa');
  const valinta = useFieldValue('pohja.valinta');

  const onContinue = useCallback(() => {
    onSelectBase({
      tapa,
      valinta: get(valinta, 'value'),
    });
  }, [onSelectBase, tapa, valinta]);

  return (
    <FormCollapse onContinue={onContinue} {...props}>
      {children}
    </FormCollapse>
  );
};

const KoulutusForm = ({
  organisaatioOid,
  steps = false,
  onAttachToteutus,
  canSelectBase = true,
  scrollTarget,
  koulutus: koulutusProp = null,
  canEditKoulutustyyppi = true,
  johtaaTutkintoon = true,
  onSelectBase = () => {},
}) => {
  const { t } = useTranslation();

  const koulutustyyppi = useFieldValue('koulutustyyppi');
  const kieliversiotValue = useFieldValue('kieliversiot');
  const koulutusValue = useFieldValue('information.koulutus');
  const languageTabs = kieliversiotValue || [];

  return (
    <FormCollapseGroup
      enabled={steps}
      scrollTarget={scrollTarget}
      defaultOpen={!steps}
    >
      {canEditKoulutustyyppi ? (
        <FormCollapse
          header={t('yleiset.koulutustyyppi')}
          scrollOnActive={false}
          {...getTestIdProps('tyyppiSection')}
        >
          <TypeSection
            name="koulutustyyppi"
            johtaaTutkintoon={johtaaTutkintoon}
          />
        </FormCollapse>
      ) : null}

      {canSelectBase ? (
        <PohjaFormCollapse
          header={t('yleiset.pohjanValinta')}
          onSelectBase={onSelectBase}
          {...getTestIdProps('pohjaSection')}
        >
          <BaseSelectionSection
            name="pohja"
            organisaatioOid={organisaatioOid}
          />
        </PohjaFormCollapse>
      ) : null}

      <FormCollapse
        header={t('yleiset.kieliversiot')}
        {...getTestIdProps('kieliversiotSection')}
      >
        <KieliversiotFields name="kieliversiot" />
      </FormCollapse>

      <FormCollapse
        header={t('koulutuslomake.koulutuksenTiedot')}
        languages={languageTabs}
        {...getTestIdProps('tiedotSection')}
      >
        <TiedotSection
          koulutustyyppi={koulutustyyppi}
          koulutusValue={koulutusValue}
          name="information"
        />
      </FormCollapse>

      <FormCollapse
        header={t('koulutuslomake.koulutuksenKuvaus')}
        languages={languageTabs}
        {...getTestIdProps('kuvausSection')}
      >
        <KuvausSection
          koulutustyyppi={koulutustyyppi}
          koulutusValue={koulutusValue}
          name="description"
        />
      </FormCollapse>

      <FormCollapse
        header={t('koulutuslomake.koulutuksenLisatiedot')}
        languages={languageTabs}
        {...getTestIdProps('lisatiedotSection')}
      >
        <LisatiedotSection name="lisatiedot" />
      </FormCollapse>

      <FormCollapse
        header={t('koulutuslomake.koulutuksenJarjestaja')}
        {...getTestIdProps('jarjestajaSection')}
      >
        <JarjestajaSection organisaatioOid={organisaatioOid} name="tarjoajat" />
      </FormCollapse>

      {isKorkeakouluKoulutustyyppi(koulutustyyppi) ? (
        <FormCollapse
          header="Koulutuksen näkyminen muille koulutustoimijoille"
          {...getTestIdProps('nakyvyysSection')}
        >
          <NakyvyysSection name="julkinen" />
        </FormCollapse>
      ) : null}

      {isFunction(onAttachToteutus) ? (
        <FormCollapse
          header={t('koulutuslomake.koulutukseenLiitetytToteutukset')}
          id="koulutukseen-liitetetyt-toteutukset"
          actions={
            <Flex justifyCenter>
              <Button color="primary" onClick={onAttachToteutus} type="button">
                {t('koulutuslomake.liitaToteutus')}
              </Button>
            </Flex>
          }
        >
          <ToteutuksetSection koulutus={koulutusProp} />
        </FormCollapse>
      ) : null}
    </FormCollapseGroup>
  );
};

export default KoulutusForm;
