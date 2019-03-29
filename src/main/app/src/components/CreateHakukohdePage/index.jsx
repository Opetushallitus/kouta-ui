import React from 'react';
import get from 'lodash/get';

import FormPage from '../FormPage';
import {
  getOrganisaatioByOid,
  getKoutaToteutusByOid,
  getKoutaHakuByOid,
  getKoulutustyyppiByKoulutusOid,
} from '../../apiUtils';
import Flex, { FlexItem } from '../Flex';
import { getFirstLanguageValue } from '../../utils';

import CreateHakukohdeHeader from './CreateHakukohdeHeader';
import CreateHakukohdeSteps from './CreateHakukohdeSteps';
import CreateHakukohdeForm from './CreateHakukohdeForm';
import CreateHakukohdeFooter from './CreateHakukohdeFooter';
import Typography from '../Typography';
import { KOULUTUSTYYPPI_CATEGORY } from '../../constants';
import useApiAsync from '../useApiAsync';
import Spin from '../Spin';
import useTranslation from '../useTranslation';

const getHakukohdeData = async ({
  organisaatioOid,
  hakuOid,
  toteutusOid,
  httpClient,
  apiUrls,
}) => {
  const [organisaatio, toteutus, haku] = await Promise.all([
    getOrganisaatioByOid({ oid: organisaatioOid, httpClient, apiUrls }),
    getKoutaToteutusByOid({ oid: toteutusOid, httpClient, apiUrls }),
    getKoutaHakuByOid({ oid: hakuOid, httpClient, apiUrls }),
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

  const koulutustyyppi =
    get(data, 'koulutustyyppi') ||
    KOULUTUSTYYPPI_CATEGORY.AMMATILLINEN_KOULUTUS;

  return (
    <FormPage
      header={<CreateHakukohdeHeader />}
      steps={<CreateHakukohdeSteps />}
      footer={<CreateHakukohdeFooter />}
    >
      {data ? (
        <>
          <Flex marginBottom={2} justifyBetween>
            <FlexItem grow={0} paddingRight={2}>
              <Typography variant="h6" marginBottom={1}>
                {t('yleiset.organisaatio')}
              </Typography>
              <Typography>
                {getFirstLanguageValue(get(data, 'organisaatio.nimi'))}
              </Typography>
            </FlexItem>
            <FlexItem grow={0}>
              <Typography variant="h6" marginBottom={1}>
                {t('yleiset.haku')}
              </Typography>
              <Typography>
                {getFirstLanguageValue(get(data, 'haku.nimi'))}
              </Typography>
            </FlexItem>
            <FlexItem grow={0}>
              <Typography variant="h6" marginBottom={1}>
                {t('yleiset.toteutus')}
              </Typography>
              <Typography>
                {getFirstLanguageValue(get(data, 'toteutus.nimi'))}
              </Typography>
            </FlexItem>
          </Flex>
          <CreateHakukohdeForm
            organisaatio={data.organisaatio}
            organisaatioOid={organisaatioOid}
            haku={data.haku}
            toteutus={data.toteutus}
            koulutustyyppi={koulutustyyppi}
          />
        </>
      ) : (
        <Spin center />
      )}
    </FormPage>
  );
};

export default CreateHakukohdePage;
