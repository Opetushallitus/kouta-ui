import { useCallback } from 'react';

import DataLoader from 'dataloader';
import _ from 'lodash';

import {
  AMMATILLISET_OPPILAITOSTYYPIT,
  KORKEAKOULU_OPPILAITOSTYYPIT,
  LUKIO_OPPILAITOSTYYPIT,
} from '#/src/constants';
import { useAuthorizedUser } from '#/src/contexts/AuthorizedUserContext';
import { useHttpClient } from '#/src/contexts/HttpClientContext';
import { useUrls } from '#/src/contexts/UrlContext';
import useApiAsync from '#/src/hooks/useApiAsync';
import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';
import getUserOrganisaatiotWithRoles from '#/src/utils/getUserOrganisaatiotWithRoles';
import getUserRoles from '#/src/utils/getUserRoles';
import { memoize } from '#/src/utils/memoize';
import getOrganisaatiotByOids from '#/src/utils/organisaatio/getOrganisaatiotByOids';

const getOrganisaatioLoader = memoize((httpClient, apiUrls) => {
  return new DataLoader(oids =>
    getOrganisaatiotByOids({ oids, httpClient, apiUrls }).then(
      organisaatiot => {
        return oids.map(
          oid => organisaatiot.find(({ oid: orgOid }) => orgOid === oid) || null
        );
      }
    )
  );
});

export const useOrganisaatioLoader = () => {
  const apiUrls = useUrls();
  const httpClient = useHttpClient();

  return getOrganisaatioLoader(httpClient, apiUrls);
};

export const useOrganisaatio = oid => {
  const organisaatioLoader = useOrganisaatioLoader();

  const promiseFn = useCallback(
    ({ oid }) => {
      return oid ? organisaatioLoader.load(oid) : Promise.resolve(null);
    },
    [organisaatioLoader]
  );

  const { data: organisaatio, ...rest } = useApiAsync({
    promiseFn,
    oid,
    watch: oid,
  });

  return { ...rest, organisaatio };
};

type UseOrganisaatiotResult = {
  organisaatiot?: Array<Record<string, any>>;
  [key: string]: unknown;
};

export const useOrganisaatiot = oids => {
  const organisaatioLoader = useOrganisaatioLoader();

  const promiseFn = useCallback(
    ({ oids }) => {
      return organisaatioLoader.loadMany(oids);
    },
    [organisaatioLoader]
  );

  const { data: organisaatiot, ...rest } = useApiAsync({
    promiseFn,
    oids,
    watch: JSON.stringify(oids),
  });

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
