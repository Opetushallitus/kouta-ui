import React, { useMemo } from 'react';

import queryString from 'query-string';
import { useTranslation } from 'react-i18next';

import { EsikatseluControls } from '#/src/components/EsikatseluControls';
import FormHeader from '#/src/components/FormHeader';
import FormPage, {
  OrganisaatioRelation,
  KoulutusRelation,
  RelationInfoContainer,
} from '#/src/components/FormPage';
import FormSteps from '#/src/components/FormSteps';
import ReduxForm from '#/src/components/ReduxForm';
import Title from '#/src/components/Title';
import { Spin } from '#/src/components/virkailija';
import {
  KOULUTUSTYYPPI,
  POHJAVALINTA,
  ENTITY,
  FormMode,
} from '#/src/constants';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import useSelectBase from '#/src/hooks/useSelectBase';
import { useKoulutusByOid } from '#/src/utils/koulutus/getKoulutusByOid';
import getFormValuesByToteutus from '#/src/utils/toteutus/getFormValuesByToteutus';
import { useToteutusByOid } from '#/src/utils/toteutus/getToteutusByOid';

import { ToteutusFooter } from './ToteutusFooter';
import ToteutusForm, { initialValues } from './ToteutusForm';

const { AMMATILLINEN_KOULUTUS, TUTKINNON_OSA, OSAAMISALA } = KOULUTUSTYYPPI;

const config = { noFieldConfigs: true };

const getCopyValues = toteutusOid => ({
  pohja: {
    tapa: POHJAVALINTA.KOPIO,
    valinta: { value: toteutusOid },
  },
});

const getInitialValues = (toteutus, koulutusNimi, koulutusKielet) => {
  return toteutus
    ? { ...getCopyValues(toteutus.oid), ...getFormValuesByToteutus(toteutus) }
    : initialValues(koulutusNimi, koulutusKielet);
};

const CreateToteutusPage = props => {
  const {
    match: {
      params: { organisaatioOid, koulutusOid },
    },
    location: { search },
    history,
  } = props;

  const {
    kopioToteutusOid,
  }: {
    kopioToteutusOid?: string;
  } = queryString.parse(search);

  const { data: koulutus, isFetching: isKoulutusFetching } = useKoulutusByOid(
    koulutusOid
  );

  const selectBase = useSelectBase(history, { kopioParam: 'kopioToteutusOid' });
  const { t } = useTranslation();

  const koulutustyyppi = koulutus?.koulutustyyppi ?? AMMATILLINEN_KOULUTUS;

  const koulutusNimi = koulutus?.nimi;
  const koulutusKielet = koulutus?.kielivalinta;

  const { data: toteutus, isFetching: isToteutusFetching } = useToteutusByOid(
    kopioToteutusOid
  );

  const initialValues = useMemo(() => {
    return [AMMATILLINEN_KOULUTUS, TUTKINNON_OSA, OSAAMISALA].includes(
      koulutustyyppi
    )
      ? getInitialValues(toteutus, koulutusNimi, koulutusKielet)
      : getInitialValues(toteutus, null, koulutusKielet);
  }, [toteutus, koulutustyyppi, koulutusNimi, koulutusKielet]);

  return (
    <ReduxForm form="toteutusForm" initialValues={initialValues}>
      <Title>{t('sivuTitlet.uusiToteutus')}</Title>
      <FormConfigContext.Provider value={config}>
        <FormPage
          header={<FormHeader>{t('yleiset.toteutus')}</FormHeader>}
          steps={<FormSteps activeStep={ENTITY.TOTEUTUS} />}
          footer={
            koulutus ? (
              <ToteutusFooter
                formMode={FormMode.CREATE}
                toteutus={toteutus}
                koulutus={koulutus}
                koulutustyyppi={koulutustyyppi}
                organisaatioOid={organisaatioOid}
                canUpdate={true}
              />
            ) : null
          }
          esikatseluControls={<EsikatseluControls />}
        >
          <RelationInfoContainer>
            <KoulutusRelation
              organisaatioOid={organisaatioOid}
              koulutus={koulutus}
            />
            <OrganisaatioRelation organisaatioOid={organisaatioOid} />
          </RelationInfoContainer>
          {!isKoulutusFetching && !isToteutusFetching ? (
            <ToteutusForm
              steps
              koulutus={koulutus}
              organisaatioOid={organisaatioOid}
              koulutustyyppi={koulutustyyppi}
              onSelectBase={selectBase}
              showArkistoituTilaOption={false}
            />
          ) : (
            <Spin center />
          )}
        </FormPage>
      </FormConfigContext.Provider>
    </ReduxForm>
  );
};

export default CreateToteutusPage;
