import React from 'react';
import queryString from 'query-string';
import get from 'lodash/get';

import FormPage from '../FormPage';
import EditHakukohdeHeader from './EditHakukohdeHeader';
import EditHakukohdeSteps from './EditHakukohdeSteps';
import EditHakukohdeForm from './EditHakukohdeForm';
import EditHakukohdeFooter from './EditHakukohdeFooter';
import useApiAsync from '../useApiAsync';
import {
  getKoutaHakukohdeByOid,
  getKoutaToteutusByOid,
  getKoutaHakuByOid,
  getOrganisaatioByOid,
  getKoulutustyyppiByKoulutusOid,
} from '../../apiUtils';
import { getFirstLanguageValue } from '../../utils';
import Flex, { FlexItem } from '../Flex';
import Typography from '../Typography';
import Spin from '../Spin';
import { KOULUTUSTYYPPI } from '../../constants';
import useTranslation from '../useTranslation';

const getData = async ({ httpClient, apiUrls, oid: hakukohdeOid }) => {
  const hakukohde = await getKoutaHakukohdeByOid({
    httpClient,
    apiUrls,
    oid: hakukohdeOid,
  });

  const { organisaatioOid, toteutusOid, hakuOid } = hakukohde;

  const [organisaatio, toteutus, haku] = await Promise.all([
    getOrganisaatioByOid({ httpClient, apiUrls, oid: organisaatioOid }),
    getKoutaToteutusByOid({ httpClient, apiUrls, oid: toteutusOid }),
    getKoutaHakuByOid({ httpClient, apiUrls, oid: hakuOid }),
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
    organisaatio,
    toteutus,
    haku,
    koulutustyyppi,
  };
};

const EditHakukohdePage = props => {
  const {
    match: {
      params: { oid },
    },
    location: { search, state = {} },
  } = props;

  const { hakukohdeUpdatedAt = null } = state;
  const { scrollTarget = null } = queryString.parse(search);
  const watch = JSON.stringify([oid, hakukohdeUpdatedAt]);

  const {
    data: { hakukohde, organisaatio, toteutus, haku, koulutustyyppi } = {},
  } = useApiAsync({
    promiseFn: getData,
    oid,
    watch,
  });

  const { t } = useTranslation();

  return (
    <FormPage
      header={<EditHakukohdeHeader hakukohde={hakukohde} />}
      steps={<EditHakukohdeSteps />}
      footer={hakukohde ? <EditHakukohdeFooter hakukohde={hakukohde} /> : null}
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
          <EditHakukohdeForm
            organisaatio={organisaatio}
            organisaatioOid={get(organisaatio, 'organisaatioOid')}
            scrollTarget={scrollTarget}
            haku={haku}
            toteutus={toteutus}
            hakukohde={hakukohde}
            koulutustyyppi={
              koulutustyyppi || KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS
            }
          />
        </>
      ) : (
        <Spin center />
      )}
    </FormPage>
  );
};

export default EditHakukohdePage;
