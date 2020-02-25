import React from 'react';
import { Redirect } from 'react-router-dom';
import useApiAsync from '../useApiAsync';
import getHakukohdeByOid from '../../utils/kouta/getHakukohdeByOid';
import useOrganisaatioHierarkia from '../useOrganisaatioHierarkia';
import useAuthorizedUser from '../useAuthorizedUser';
import getUserRoles from '../../utils/getUserRoles';
import getUserOrganisaatiotWithRoles from '../../utils/getUserOrganisaatiotWithRoles';
import uniqBy from 'lodash/uniqBy';
import first from 'lodash/first';
import Spin from '@opetushallitus/virkailija-ui-components/Spin';
import Flex, { FlexItem } from '../Flex';

const Loader = () => (
  <Flex alignCenter column>
    <FlexItem marginBottom={1}>
      <Spin />
    </FlexItem>
  </Flex>
);

const isParent = parentOid => org => org.parentOidPath.includes(parentOid);
const isChild = childOid => org =>
  org.oid === childOid || first(org.children.filter(isChild(childOid)));

const getData = async ({ httpClient, apiUrls, oid: hakukohdeOid }) => {
  const hakukohde = await getHakukohdeByOid({
    httpClient,
    apiUrls,
    oid: hakukohdeOid,
  });
  return { hakukohde };
};

const Hierarkia = ({ hakukohde, hierarkia }) => {
  const user = useAuthorizedUser();
  const roles = getUserRoles(user);
  const orgs = uniqBy(getUserOrganisaatiotWithRoles(user, roles));
  const firstChildOrganisation = first(
    orgs.filter(org => hierarkia.filter(isChild(org))),
  );
  const firstParentOrganisation = first(
    orgs.filter(org => hierarkia.filter(isParent(org))),
  );

  const preferredOrganisation =
    firstChildOrganisation ||
    firstParentOrganisation ||
    hakukohde.organisaatioOid;

  return (
    <Redirect
      to={`/organisaatio/${preferredOrganisation}/hakukohde/${hakukohde.oid}/muokkaus`}
    />
  );
};

const Hakukohde = ({ hakukohde }) => {
  const { hierarkia } = useOrganisaatioHierarkia(hakukohde.organisaatioOid, {
    skipParents: false,
  });
  return hierarkia ? (
    <Hierarkia hakukohde={hakukohde} hierarkia={hierarkia} />
  ) : (
    <Loader />
  );
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
