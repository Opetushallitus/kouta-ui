import React from 'react';
import get from 'lodash/get';

import ApiAsync from '../ApiAsync';
import FormPage from '../FormPage';
import {
  getOrganisaatioByOid,
} from '../../apiUtils';
import Flex, { FlexItem } from '../Flex';
import { getFirstLanguageValue } from '../../utils';

import CreateHakuHeader from './CreateHakuHeader';
import CreateHakuSteps from './CreateHakuSteps';
import CreateHakuForm from './CreateHakuForm';
import CreateHakuFooter from './CreateHakuFooter';
import Typography from '../Typography';

const getHakuData = async ({
  organisaatioOid,
  httpClient,
  apiUrls,
}) => {
  const [organisaatio] = await Promise.all([
    getOrganisaatioByOid({ oid: organisaatioOid, httpClient, apiUrls }),
  ]);

  return {
    organisaatio,
  };
};

const CreateHakuFormAsync = ({
  organisaatioOid,
}) => (
  <>
    <ApiAsync
      promiseFn={getHakuData}
      organisaatioOid={organisaatioOid}
      watch={[organisaatioOid].join(',')}
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
            <CreateHakuForm
              organisaatio={data.organisaatio}
              organisaatioOid={organisaatioOid}
            />
          </>
        ) : null
      }
    </ApiAsync>
  </>
);

const CreateHakuPage = props => {
  const {
    match: {
      params: { organisaatioOid },
    },
  } = props;

  return (
    <FormPage
      header={<CreateHakuHeader />}
      steps={<CreateHakuSteps />}
      footer={<CreateHakuFooter />}
    >
      <CreateHakuFormAsync
        organisaatioOid={organisaatioOid}
      />
    </FormPage>
  );
};

export default CreateHakuPage;
