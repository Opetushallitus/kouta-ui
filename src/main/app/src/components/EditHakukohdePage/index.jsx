import React, { useMemo } from 'react';
import queryString from 'query-string';

import FormPage from '../FormPage';
import EditHakukohdeHeader from './EditHakukohdeHeader';
import EditHakukohdeSteps from './EditHakukohdeSteps';
import EditHakukohdeFooter from './EditHakukohdeFooter';
import useApiAsync from '../useApiAsync';
import Spin from '../Spin';
import { KOULUTUSTYYPPI } from '../../constants';
import { useTranslation } from 'react-i18next';
import getKoulutustyyppiByKoulutusOid from '../../utils/kouta/getKoulutustyyppiByKoulutusOid';
import getToteutusByOid from '../../utils/kouta/getToteutusByOid';
import Title from '../Title';
import getHakuByOid from '../../utils/kouta/getHakuByOid';
import getHakukohdeByOid from '../../utils/kouta/getHakukohdeByOid';
import ReduxForm from '#/src/components/ReduxForm';
import getHakukohdeFormConfig from '#/src/utils/getHakukohdeFormConfig';
import getFormValuesByHakukohde from '#/src/utils/getFormValuesByHakukohde';
import FormConfigContext from '#/src/components/FormConfigContext';
import HakukohdeForm from '#/src/components/HakukohdeForm';
import {
  RelationInfoContainer,
  OrganisaatioRelation,
  HakuRelation,
  ToteutusRelation,
} from '#/src/components/FormPage';

const getData = async ({ httpClient, apiUrls, oid: hakukohdeOid }) => {
  const hakukohde = await getHakukohdeByOid({
    httpClient,
    apiUrls,
    oid: hakukohdeOid,
  });

  const { toteutusOid, hakuOid } = hakukohde;

  const [toteutus, haku] = await Promise.all([
    getToteutusByOid({ httpClient, apiUrls, oid: toteutusOid }),
    getHakuByOid({ httpClient, apiUrls, oid: hakuOid }),
  ]);

  const koulutustyyppi = await (toteutus && toteutus.koulutusOid
    ? getKoulutustyyppiByKoulutusOid({
        oid: toteutus.koulutusOid,
        httpClient,
        apiUrls,
      })
    : null);

  return {
    hakukohde,
    toteutus,
    haku,
    koulutustyyppi,
  };
};

const EditHakukohdePage = props => {
  const {
    match: {
      params: { organisaatioOid, oid },
    },
    location: { search, state = {} },
  } = props;

  const { hakukohdeUpdatedAt = null } = state;
  const { scrollTarget = null } = queryString.parse(search);
  const watch = JSON.stringify([oid, hakukohdeUpdatedAt]);

  const {
    data: { hakukohde, toteutus, haku, koulutustyyppi } = {},
  } = useApiAsync({
    promiseFn: getData,
    oid,
    watch,
  });

  const { t } = useTranslation();

  const initialValues = useMemo(() => {
    return hakukohde && getFormValuesByHakukohde(hakukohde);
  }, [hakukohde]);

  const config = useMemo(getHakukohdeFormConfig, []);

  return !hakukohde ? (
    <Spin center />
  ) : (
    <ReduxForm form="editHakukohdeForm" initialValues={initialValues}>
      <Title>{t('sivuTitlet.hakukohteenMuokkaus')}</Title>
      <FormPage
        header={<EditHakukohdeHeader hakukohde={hakukohde} />}
        steps={<EditHakukohdeSteps />}
        footer={
          hakukohde ? (
            <EditHakukohdeFooter
              hakukohde={hakukohde}
              toteutus={toteutus}
              haku={haku}
            />
          ) : null
        }
      >
        {hakukohde ? (
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
                steps={false}
                organisaatioOid={organisaatioOid}
                scrollTarget={scrollTarget}
                haku={haku}
                toteutus={toteutus}
                hakukohde={hakukohde}
                koulutustyyppi={
                  koulutustyyppi || KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS
                }
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

export default EditHakukohdePage;
