import React from 'react';
import { Redirect } from 'react-router-dom';
import useApiAsync from '#/src/hooks/useApiAsync';
import { usePreferredOrganisaatio } from '#/src/hooks/useOrganisaatio';
import getHakukohdeByOid from '#/src/utils/hakukohde/getHakukohdeByOid';
import Spin from '@opetushallitus/virkailija-ui-components/Spin';
import Flex, { FlexItem } from '#/src/components/Flex';

const Loader = () => (
  <Flex alignCenter column>
    <FlexItem marginBottom={1}>
      <Spin />
    </FlexItem>
  </Flex>
);

const Hakukohde = ({ hakukohde }) => {
  const { preferredOrganisaatio } = usePreferredOrganisaatio(
    hakukohde.organisaatioOid
  );
  return preferredOrganisaatio ? (
    <Redirect
      to={`/organisaatio/${preferredOrganisaatio}/hakukohde/${hakukohde.oid}/muokkaus`}
    />
  ) : (
    <Loader />
  );
};

const getData = async ({ httpClient, apiUrls, oid: hakukohdeOid }) => {
  const hakukohde = await getHakukohdeByOid({
    httpClient,
    apiUrls,
    oid: hakukohdeOid,
  });
  return { hakukohde };
};

const RedirectHakukohdeFooter = props => {
  const {
    match: {
      params: { oid },
    },
  } = props;

  const watch = JSON.stringify([oid]);

  const { data: { hakukohde } = {} } = useApiAsync({
    promiseFn: getData,
    oid,
    watch,
  });

  return hakukohde ? <Hakukohde hakukohde={hakukohde} /> : <Loader />;
};

export default RedirectHakukohdeFooter;
