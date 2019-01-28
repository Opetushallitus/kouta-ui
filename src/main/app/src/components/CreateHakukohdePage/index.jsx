import React from 'react';
import get from 'lodash/get';

import ApiAsync from '../ApiAsync';
import FormPage from '../FormPage';
import {
  getOrganisaatioByOid,
  getKoutaToteutusByOid,
  getKoutaHakuByOid,
} from '../../apiUtils';
import Flex, { FlexItem } from '../Flex';
import { getFirstLanguageValue } from '../../utils';

import CreateHakukohdeHeader from './CreateHakukohdeHeader';
import CreateHakukohdeSteps from './CreateHakukohdeSteps';
import CreateHakukohdeForm from './CreateHakukohdeForm';
import CreateHakukohdeFooter from './CreateHakukohdeFooter';
import Typography from '../Typography';

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

  return {
    organisaatio,
    toteutus,
    haku,
  };
};

const CreateHakukohdeFormAsync = ({
  koulutusOid,
  organisaatioOid,
  toteutusOid,
  hakuOid,
}) => (
  <>
    <ApiAsync
      promiseFn={getHakukohdeData}
      organisaatioOid={organisaatioOid}
      toteutusOid={toteutusOid}
      hakuOid={hakuOid}
      watch={[organisaatioOid, toteutusOid, hakuOid].join(',')}
    >
      {({ data }) =>
        data ? (
          <>
            <Flex marginBottom={2} justifyBetween>
              <FlexItem grow={0} paddingRight={2}>
                <Typography variant="h6" marginBottom={1}>
                  Organisaatio
                </Typography>
                <Typography>
                  {getFirstLanguageValue(get(data, 'organisaatio.nimi'))}
                </Typography>
              </FlexItem>
              <FlexItem grow={0}>
                <Typography variant="h6" marginBottom={1}>
                  Haku
                </Typography>
                <Typography>
                  {getFirstLanguageValue(get(data, 'haku.nimi'))}
                </Typography>
              </FlexItem>
              <FlexItem grow={0}>
              <Typography variant="h6" marginBottom={1}>
                  Toteutus
                </Typography>
                <Typography>{getFirstLanguageValue(get(data, 'toteutus.nimi'))}</Typography>
              </FlexItem>
            </Flex>
            <CreateHakukohdeForm
              organisaatio={data.organisaatio}
              organisaatioOid={organisaatioOid}
              haku={data.haku}
              toteutus={data.toteutus}
            />
          </>
        ) : null
      }
    </ApiAsync>
  </>
);

const CreateHakukohdePage = props => {
  const {
    match: {
      params: { organisaatioOid, toteutusOid, hakuOid },
    },
  } = props;

  return (
    <FormPage
      header={<CreateHakukohdeHeader />}
      steps={<CreateHakukohdeSteps />}
      footer={<CreateHakukohdeFooter />}
    >
      <CreateHakukohdeFormAsync
        toteutusOid={toteutusOid}
        hakuOid={hakuOid}
        organisaatioOid={organisaatioOid}
      />
    </FormPage>
  );
};

export default CreateHakukohdePage;
