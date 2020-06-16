import React, { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import _ from 'lodash';

import { KOULUTUSTYYPPI, POHJAVALINTA, ENTITY } from '#/src/constants';
import getToteutusByFormValues from '#/src/utils/getToteutusByFormValues';
import getKoulutusByOid from '#/src/utils/kouta/getKoulutusByOid';
import getToteutusByOid from '#/src/utils/kouta/getToteutusByOid';
import createToteutus from '#/src/utils/kouta/createToteutus';
import getFormValuesByToteutus from '#/src/utils/getFormValuesByToteutus';

import FormPage, {
  OrganisaatioRelation,
  KoulutusRelation,
  RelationInfoContainer,
  FormFooter,
} from '#/src/components/FormPage';
import ReduxForm from '#/src/components/ReduxForm';
import { initialValues } from '#/src/components/ToteutusForm';
import Spin from '#/src/components/Spin';
import Title from '#/src/components/Title';
import { useSaveToteutus } from '#/src/hooks/formSaveHooks';
import useApiAsync from '#/src/components/useApiAsync';
import useSelectBase from '#/src/components/useSelectBase';
import ToteutusFormWrapper from './ToteutusFormWrapper';
import FormHeader from '#/src/components/FormHeader';
import FormSteps from '#/src/components/FormSteps';

const resolveFn = () => Promise.resolve();

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

  const { kopioToteutusOid = null } = queryString.parse(search);

  const { data: koulutus } = useApiAsync({
    promiseFn: getKoulutusByOid,
    oid: koulutusOid,
    watch: koulutusOid,
  });

  const selectBase = useSelectBase(history, { kopioParam: 'kopioToteutusOid' });
  const { t } = useTranslation();

  const koulutustyyppi =
    koulutus && koulutus.koulutustyyppi
      ? koulutus.koulutustyyppi
      : KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS;

  const koulutusNimi = _.get(koulutus, 'nimi');
  const koulutusKielet = _.get(koulutus, 'kielivalinta');

  const promiseFn = kopioToteutusOid ? getToteutusByOid : resolveFn;

  const { data } = useApiAsync({
    promiseFn,
    oid: kopioToteutusOid,
    watch: kopioToteutusOid,
  });
  const initialValues = useMemo(() => {
    return koulutustyyppi === 'amm'
      ? getInitialValues(data, koulutusNimi, koulutusKielet)
      : getInitialValues(data, null, koulutusKielet);
  }, [data, koulutustyyppi, koulutusNimi, koulutusKielet]);

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const { oid } = await createToteutus({
        httpClient,
        apiUrls,
        toteutus: {
          ...getToteutusByFormValues({ ...values, koulutustyyppi }),
          organisaatioOid,
          koulutusOid,
        },
      });

      history.push(`/organisaatio/${organisaatioOid}/toteutus/${oid}/muokkaus`);
    },
    [organisaatioOid, history, koulutustyyppi, koulutusOid]
  );

  const FORM_NAME = 'createToteutusForm';

  const save = useSaveToteutus({
    submit,
    formName: FORM_NAME,
    koulutustyyppi,
    koulutus,
  });

  return (
    <ReduxForm form={FORM_NAME} initialValues={initialValues}>
      <Title>{t('sivuTitlet.uusiToteutus')}</Title>
      <FormPage
        header={<FormHeader>{t('yleiset.toteutus')}</FormHeader>}
        steps={<FormSteps activeStep={ENTITY.TOTEUTUS} />}
        footer={
          koulutus ? <FormFooter entity={ENTITY.TOTEUTUS} save={save} /> : null
        }
      >
        <RelationInfoContainer>
          <KoulutusRelation
            organisaatioOid={organisaatioOid}
            koulutus={koulutus}
          />
          <OrganisaatioRelation organisaatioOid={organisaatioOid} />
        </RelationInfoContainer>
        {koulutus ? (
          <ToteutusFormWrapper
            steps
            koulutus={koulutus}
            ePerusteId={koulutus.ePerusteId}
            koulutusKoodiUri={koulutus.koulutusKoodiUri}
            koulutusNimi={koulutus.nimi}
            koulutusKielet={koulutus.kielivalinta}
            organisaatioOid={organisaatioOid}
            koulutustyyppi={koulutustyyppi}
            kopioToteutusOid={kopioToteutusOid}
            onSelectBase={selectBase}
            showArkistoituTilaOption={false}
          />
        ) : (
          <Spin center />
        )}
      </FormPage>
    </ReduxForm>
  );
};

export default CreateToteutusPage;
