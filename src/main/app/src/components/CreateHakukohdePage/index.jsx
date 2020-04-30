import React, { useMemo } from 'react';
import { get } from 'lodash';

import FormPage from '../FormPage';
import getOrganisaatioByOid from '../../utils/organisaatioService/getOrganisaatioByOid';
import getKoulutustyyppiByKoulutusOid from '../../utils/kouta/getKoulutustyyppiByKoulutusOid';
import CreateHakukohdeHeader from './CreateHakukohdeHeader';
import CreateHakukohdeSteps from './CreateHakukohdeSteps';
import CreateHakukohdeFooter from './CreateHakukohdeFooter';
import { KOULUTUSTYYPPI } from '../../constants';
import useApiAsync from '../useApiAsync';
import Spin from '../Spin';
import { useTranslation } from 'react-i18next';
import getToteutusByOid from '../../utils/kouta/getToteutusByOid';
import Title from '../Title';
import getHakuByOid from '../../utils/kouta/getHakuByOid';
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

  const { data } = useApiAsync({
    promiseFn: getHakukohdeData,
    organisaatioOid: organisaatioOid,
    toteutusOid: toteutusOid,
    hakuOid: hakuOid,
    watch: [organisaatioOid, toteutusOid, hakuOid].join(','),
  });

  const haku = get(data, 'haku');
  const toteutus = get(data, 'toteutus');

  const initialValues = useMemo(() => {
    return (
      data &&
      getInitialValues(
        get(data, 'toteutus.nimi'),
        get(data, 'toteutus.kielivalinta'),
      )
    );
  }, [data]);

  const config = useMemo(getHakukohdeFormConfig, []);

  return (
    <ReduxForm
      form="createHakukohdeForm"
      enableReinitialize
      initialValues={initialValues}
    >
      <Title>{t('sivuTitlet.uusiHakukohde')}</Title>
      <FormPage
        header={<CreateHakukohdeHeader />}
        steps={<CreateHakukohdeSteps />}
        footer={
          <CreateHakukohdeFooter
            organisaatioOid={organisaatioOid}
            hakuOid={hakuOid}
            toteutusOid={toteutusOid}
            haku={haku}
            toteutus={toteutus}
          />
        }
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
                  get(data, 'koulutustyyppi') ||
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
