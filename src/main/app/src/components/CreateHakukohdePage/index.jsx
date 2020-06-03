import React, { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

import FormPage, { FormFooter } from '#/src/components/FormPage';
import getOrganisaatioByOid from '#/src/utils/organisaatioService/getOrganisaatioByOid';
import getKoulutustyyppiByKoulutusOid from '#/src/utils/kouta/getKoulutustyyppiByKoulutusOid';
import { KOULUTUSTYYPPI, ENTITY } from '#/src/constants';
import useApiAsync from '#/src/components/useApiAsync';
import Spin from '#/src/components/Spin';
import getToteutusByOid from '#/src/utils/kouta/getToteutusByOid';
import Title from '#/src/components/Title';
import getHakuByOid from '#/src/utils/kouta/getHakuByOid';
import ReduxForm from '#/src/components/ReduxForm';
import HakukohdeForm, { initialValues } from '#/src/components/HakukohdeForm';
import getHakukohdeFormConfig from '#/src/utils/getHakukohdeFormConfig';
import FormConfigContext from '#/src/components/FormConfigContext';
import {
  RelationInfoContainer,
  OrganisaatioRelation,
  HakuRelation,
  ToteutusRelation,
} from '#/src/components/FormPage';
import FormHeader from '#/src/components/FormHeader';
import FormSteps from '#/src/components/FormSteps';
import { useHistory } from 'react-router-dom';
import createHakukohde from '#/src/utils/kouta/createHakukohde';
import getHakukohdeByFormValues from '#/src/utils/getHakukohdeByFormValues';
import { useSaveHakukohde } from '#/src/hooks/formSaveHooks';

const getHakukohdeData = async ({
  organisaatioOid,
  hakuOid,
  toteutusOid,
  httpClient,
  apiUrls,
}) => {
  const [organisaatio, toteutus, haku] = await Promise.all([
    getOrganisaatioByOid({ oid: organisaatioOid, httpClient, apiUrls }),
    getToteutusByOid({ oid: toteutusOid, httpClient, apiUrls }),
    getHakuByOid({ oid: hakuOid, httpClient, apiUrls }),
  ]);

  const koulutustyyppi = await (toteutus && toteutus.koulutusOid
    ? getKoulutustyyppiByKoulutusOid({
        oid: toteutus.koulutusOid,
        httpClient,
        apiUrls,
      })
    : null);

  return {
    organisaatio,
    toteutus,
    haku,
    koulutustyyppi,
  };
};

const getInitialValues = (toteutusNimi, toteutusKielet) => {
  return initialValues(toteutusNimi, toteutusKielet);
};

const CreateHakukohdePage = props => {
  const {
    match: {
      params: { organisaatioOid, toteutusOid, hakuOid },
    },
  } = props;

  const { t } = useTranslation();
  const history = useHistory();

  const { data } = useApiAsync({
    promiseFn: getHakukohdeData,
    organisaatioOid: organisaatioOid,
    toteutusOid: toteutusOid,
    hakuOid: hakuOid,
    watch: [organisaatioOid, toteutusOid, hakuOid].join(','),
  });

  const haku = _.get(data, 'haku');
  const toteutus = _.get(data, 'toteutus');

  const initialValues = useMemo(() => {
    return (
      data &&
      getInitialValues(
        _.get(data, 'toteutus.nimi'),
        _.get(data, 'toteutus.kielivalinta')
      )
    );
  }, [data]);

  const config = useMemo(getHakukohdeFormConfig, []);

  const submit = useCallback(
    async ({ httpClient, apiUrls, values }) => {
      const { oid } = await createHakukohde({
        httpClient,
        apiUrls,
        hakukohde: {
          ...getHakukohdeByFormValues(values),
          organisaatioOid,
          hakuOid,
          toteutusOid,
        },
      });

      history.push(
        `/organisaatio/${organisaatioOid}/hakukohde/${oid}/muokkaus`
      );
    },
    [organisaatioOid, hakuOid, toteutusOid, history]
  );

  const FORM_NAME = 'createHakukohdeForm';

  const save = useSaveHakukohde({
    submit,
    haku,
    toteutus,
    formName: FORM_NAME,
  });

  return (
    <ReduxForm
      form="createHakukohdeForm"
      enableReinitialize
      initialValues={initialValues}
    >
      <Title>{t('sivuTitlet.uusiHakukohde')}</Title>
      <FormPage
        header={<FormHeader>{t('yleiset.hakukohde')}</FormHeader>}
        steps={<FormSteps activeStep={ENTITY.HAKUKOHDE} {...props} />}
        footer={<FormFooter entity={ENTITY.HAKUKOHDE} save={save} />}
      >
        {data ? (
          <>
            <RelationInfoContainer>
              <HakuRelation organisaatioOid={organisaatioOid} haku={haku} />
              <ToteutusRelation
                organisaatioOid={organisaatioOid}
                toteutus={toteutus}
              />
              <OrganisaatioRelation organisaatioOid={organisaatioOid} />
            </RelationInfoContainer>
            <FormConfigContext.Provider value={config}>
              <HakukohdeForm
                steps
                organisaatio={data.organisaatio}
                organisaatioOid={organisaatioOid}
                haku={haku}
                toteutus={toteutus}
                koulutustyyppi={
                  _.get(data, 'koulutustyyppi') ||
                  KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS
                }
                showArkistoituTilaOption={false}
              />
            </FormConfigContext.Provider>
          </>
        ) : (
          <Spin center />
        )}
      </FormPage>
    </ReduxForm>
  );
};

export default CreateHakukohdePage;
