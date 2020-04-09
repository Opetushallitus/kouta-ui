import React, { useMemo } from 'react';
import queryString from 'query-string';
import { get } from 'lodash';

import FormPage from '../FormPage';
import EditHakukohdeHeader from './EditHakukohdeHeader';
import EditHakukohdeSteps from './EditHakukohdeSteps';
import EditHakukohdeFooter from './EditHakukohdeFooter';
import useApiAsync from '../useApiAsync';
import { getFirstLanguageValue } from '../../utils';
import Flex, { FlexItem } from '../Flex';
import Typography from '../Typography';
import Spin from '../Spin';
import { KOULUTUSTYYPPI } from '../../constants';
import { useTranslation } from 'react-i18next';
import getKoulutustyyppiByKoulutusOid from '../../utils/kouta/getKoulutustyyppiByKoulutusOid';
import getToteutusByOid from '../../utils/kouta/getToteutusByOid';
import Title from '../Title';
import getHakuByOid from '../../utils/kouta/getHakuByOid';
import getHakukohdeByOid from '../../utils/kouta/getHakukohdeByOid';
import useOrganisaatio from '../useOrganisaatio';
import ReduxForm from '#/src/components/ReduxForm';
import getHakukohdeFormConfig from '#/src/utils/getHakukohdeFormConfig';
import getFormValuesByHakukohde from '#/src/utils/getFormValuesByHakukohde';
import FormConfigContext from '#/src/components/FormConfigContext';
import HakukohdeForm from '#/src/components/HakukohdeForm';

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

const config = getHakukohdeFormConfig();

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

  const { organisaatio } = useOrganisaatio(organisaatioOid);
  const { t } = useTranslation();

  const initialValues = useMemo(() => {
    return hakukohde && getFormValuesByHakukohde(hakukohde);
  }, [hakukohde]);
  return !hakukohde ? (
    <Spin center />
  ) : (
    <ReduxForm form="editHakukohdeForm" initialValues={initialValues}>
      {() => (
        <>
          <Title>{t('sivuTitlet.hakukohteenMuokkaus')}</Title>
          <FormPage
            header={<EditHakukohdeHeader hakukohde={hakukohde} />}
            steps={<EditHakukohdeSteps />}
            footer={
              hakukohde ? <EditHakukohdeFooter hakukohde={hakukohde} /> : null
            }
          >
            {hakukohde ? (
              <>
                <Flex marginBottom={2} justifyBetween>
                  <FlexItem grow={0} paddingRight={2}>
                    <Typography variant="h6" marginBottom={1}>
                      {t('yleiset.organisaatio')}
                    </Typography>
                    <Typography>
                      {getFirstLanguageValue(get(organisaatio, 'nimi'))}
                    </Typography>
                  </FlexItem>
                  <FlexItem grow={0}>
                    <Typography variant="h6" marginBottom={1}>
                      {t('yleiset.haku')}
                    </Typography>
                    <Typography>
                      {getFirstLanguageValue(get(haku, 'nimi'))}
                    </Typography>
                  </FlexItem>
                  <FlexItem grow={0}>
                    <Typography variant="h6" marginBottom={1}>
                      {t('yleiset.toteutus')}
                    </Typography>
                    <Typography>
                      {getFirstLanguageValue(get(toteutus, 'nimi'))}
                    </Typography>
                  </FlexItem>
                </Flex>
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
        </>
      )}
    </ReduxForm>
  );
};

export default EditHakukohdePage;
