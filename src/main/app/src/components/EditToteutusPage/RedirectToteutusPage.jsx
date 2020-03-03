import React from 'react';
import { Redirect } from 'react-router-dom';
import useApiAsync from '../useApiAsync';
import { usePreferredOrganisaatio } from '../useOrganisaatio';
import Spin from '@opetushallitus/virkailija-ui-components/Spin';
import Flex, { FlexItem } from '../Flex';
import getToteutusByOid from '../../utils/kouta/getToteutusByOid';

const Loader = () => (
  <Flex alignCenter column>
    <FlexItem marginBottom={1}>
      <Spin />
    </FlexItem>
  </Flex>
);

const Toteutus = ({ toteutus }) => {
  const { preferredOrganisaatio } = usePreferredOrganisaatio(
    toteutus.organisaatioOid,
  );
  return preferredOrganisaatio ? (
    <Redirect
      to={`/organisaatio/${preferredOrganisaatio}/toteutus/${toteutus.oid}/muokkaus`}
    />
  ) : (
    <Loader />
  );
};

const getData = async ({ httpClient, apiUrls, oid: toteutusOid }) => {
  const toteutus = await getToteutusByOid({
    httpClient,
    apiUrls,
    oid: toteutusOid,
  });
  return { toteutus };
};

const RedirectToteutusFooter = props => {
  const {
    match: {
      params: { oid },
    },
  } = props;

  const watch = JSON.stringify([oid]);

  const { data: { toteutus } = {} } = useApiAsync({
    promiseFn: getData,
    oid,
    watch,
  });

  return toteutus ? <Toteutus toteutus={toteutus} /> : <Loader />;
};

export default RedirectToteutusFooter;
