import React from 'react';
import { Redirect } from 'react-router-dom';
import useApiAsync from '../useApiAsync';
import { usePreferredOrganisaatio } from '../useOrganisaatio';
import Spin from '@opetushallitus/virkailija-ui-components/Spin';
import Flex, { FlexItem } from '../Flex';
import getValintaperusteByOid from '../../utils/kouta/getValintaperusteByOid';

const Loader = () => (
  <Flex alignCenter column>
    <FlexItem marginBottom={1}>
      <Spin />
    </FlexItem>
  </Flex>
);

const Valintaperuste = ({ valintaperuste }) => {
  const { preferredOrganisaatio } = usePreferredOrganisaatio(
    valintaperuste.organisaatioOid
  );
  return preferredOrganisaatio ? (
    <Redirect
      to={`/organisaatio/${preferredOrganisaatio}/valintaperusteet/${valintaperuste.oid}/muokkaus`}
    />
  ) : (
    <Loader />
  );
};

const getData = async ({ httpClient, apiUrls, oid: valintaperusteOid }) => {
  const valintaperuste = await getValintaperusteByOid({
    httpClient,
    apiUrls,
    oid: valintaperusteOid,
  });
  return { valintaperuste };
};

const RedirectValintaperusteFooter = props => {
  const {
    match: {
      params: { oid },
    },
  } = props;

  const watch = JSON.stringify([oid]);

  const { data: { valintaperuste } = {} } = useApiAsync({
    promiseFn: getData,
    oid,
    watch,
  });

  return valintaperuste ? (
    <Valintaperuste valintaperuste={valintaperuste} />
  ) : (
    <Loader />
  );
};

export default RedirectValintaperusteFooter;
