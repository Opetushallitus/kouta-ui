import _ from 'lodash';

import {
  AMMATILLISET_OPPILAITOSTYYPIT,
  KORKEAKOULU_OPPILAITOSTYYPIT,
  LUKIO_OPPILAITOSTYYPIT,
  LONG_CACHE_QUERY_OPTIONS,
} from '#/src/constants';
import { useAuthorizedUser } from '#/src/contexts/AuthorizedUserContext';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';
import getUserOrganisaatiotWithRoles from '#/src/utils/getUserOrganisaatiotWithRoles';
import getUserRoles from '#/src/utils/getUserRoles';
import getOrganisaatiotByOids from '#/src/utils/organisaatio/getOrganisaatiotByOids';

export const useOrganisaatio = oid => {
  const { organisaatiot, ...rest } = useOrganisaatiot(oid);

  return { organisaatio: organisaatiot?.[0], ...rest };
};

type UseOrganisaatiotResult = {
  organisaatiot?: Array<Record<string, any>>;
  [key: string]: unknown;
};

export const useOrganisaatiot = oids => {
  const { data: organisaatiot, ...rest } = useApiQuery(
    'getOrganisaatiot',
    getOrganisaatiotByOids,
    { oids: _.castArray(oids) },
    {
      ...LONG_CACHE_QUERY_OPTIONS,
      enabled: !_.isEmpty(oids) && !_.isNil(oids),
      retry: 0,
    }
  );

  return { ...rest, organisaatiot } as UseOrganisaatiotResult;
};

const oppilaitostyyppiToKoulutustyyppi = o =>
  _.cond([
    [_ => AMMATILLISET_OPPILAITOSTYYPIT.includes(_), _ => 'Amm'],
    [_ => KORKEAKOULU_OPPILAITOSTYYPIT.includes(_), _ => 'Yo'],
    [_ => LUKIO_OPPILAITOSTYYPIT.includes(_), _ => 'Lk'],
  ])(o?.oppilaitostyyppi);

const isParent = parentOid => org => org.parentOidPath.includes(parentOid);

const isChild = childOid => org =>
  org.oid === childOid || _.head(org.children?.filter(isChild(childOid)));

const isSameKoulutustyyppi = koulutustyyppi => org =>
  oppilaitostyyppiToKoulutustyyppi(org) === koulutustyyppi ||
  _.head(org.children?.filter(isSameKoulutustyyppi(koulutustyyppi)));

export const isSameKoulutustyyppiWithOrganisaatio = (
  organisaatio,
  hierarkia
) => {
  const koulutustyyppi = oppilaitostyyppiToKoulutustyyppi(organisaatio);

  return (
    koulutustyyppi &&
    _.head(hierarkia?.filter(isSameKoulutustyyppi(koulutustyyppi)))
  );
};

export const usePreferredOrganisaatio = creatorOrganisaatioOid => {
  const user = useAuthorizedUser();
  const roles = getUserRoles(user);
  const orgOids = _.uniq(getUserOrganisaatiotWithRoles(user, roles));
  const { organisaatiot } = useOrganisaatiot(orgOids);
  const { hierarkia } = useOrganisaatioHierarkia(creatorOrganisaatioOid, {
    skipParents: false,
  });
  const firstSameKoulutustyyppiOrganisation =
    organisaatiot &&
    hierarkia &&
    _.head(
      organisaatiot
        .filter(org => isSameKoulutustyyppiWithOrganisaatio(org, hierarkia))
        .map(_ => _.oid)
    );
  const firstChildOrganisation =
    organisaatiot &&
    hierarkia &&
    _.head(orgOids.filter(org => hierarkia.filter(isChild(org.oid))));
  const firstParentOrganisation =
    organisaatiot &&
    hierarkia &&
    _.head(orgOids.filter(org => hierarkia.filter(isParent(org.oid))));

  const preferredOrganisaatio =
    organisaatiot &&
    hierarkia &&
    (firstSameKoulutustyyppiOrganisation ||
      firstChildOrganisation ||
      firstParentOrganisation ||
      creatorOrganisaatioOid);

  return { preferredOrganisaatio };
};

export default useOrganisaatio;
