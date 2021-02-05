import { useCallback } from 'react';

import DataLoader from 'dataloader';
import { cond, first, uniqBy } from 'lodash';

import { useUrls, useHttpClient } from '#/src/contexts/contextHooks';
import useApiAsync from '#/src/hooks/useApiAsync';
import useAuthorizedUser from '#/src/hooks/useAuthorizedUser';
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

  return { ...rest, organisaatiot };
};

const ammTyypit = [
  'oppilaitostyyppi_21#1',
  'oppilaitostyyppi_22#1',
  'oppilaitostyyppi_23#1',
  'oppilaitostyyppi_24#1',
];
const yoTyypit = [
  'oppilaitostyyppi_42#1',
  'oppilaitostyyppi_43#1',
  'oppilaitostyyppi_45#1',
];
const lkTyypit = ['oppilaitostyyppi_15#1', 'oppilaitostyyppi_19#1'];

const oppilaitostyyppiToKoulutustyyppi = o =>
  cond([
    [_ => ammTyypit.includes(_), _ => 'Amm'],
    [_ => yoTyypit.includes(_), _ => 'Yo'],
    [_ => lkTyypit.includes(_), _ => 'Lk'],
  ])(o?.oppilaitostyyppi);

const isParent = parentOid => org => org.parentOidPath.includes(parentOid);

const isChild = childOid => org =>
  org.oid === childOid || first(org.children?.filter(isChild(childOid)));

const isSameKoulutustyyppi = koulutustyyppi => org =>
  oppilaitostyyppiToKoulutustyyppi(org) === koulutustyyppi ||
  first(org.children?.filter(isSameKoulutustyyppi(koulutustyyppi)));

export const isSameKoulutustyyppiWithOrganisaatio = (
  organisaatio,
  hierarkia
) => {
  const koulutustyyppi = oppilaitostyyppiToKoulutustyyppi(organisaatio);

  return (
    koulutustyyppi &&
    first(hierarkia?.filter(isSameKoulutustyyppi(koulutustyyppi)))
  );
};

export const usePreferredOrganisaatio = creatorOrganisaatioOid => {
  const user = useAuthorizedUser();
  const roles = getUserRoles(user);
  const orgOids = uniqBy(getUserOrganisaatiotWithRoles(user, roles));
  const { organisaatiot } = useOrganisaatiot(orgOids);
  const { hierarkia } = useOrganisaatioHierarkia(creatorOrganisaatioOid, {
    skipParents: false,
  });
  const firstSameKoulutustyyppiOrganisation =
    organisaatiot &&
    hierarkia &&
    first(
      organisaatiot
        .filter(org => isSameKoulutustyyppiWithOrganisaatio(org, hierarkia))
        .map(_ => _.oid)
    );
  const firstChildOrganisation =
    organisaatiot &&
    hierarkia &&
    first(orgOids.filter(org => hierarkia.filter(isChild(org.oid))));
  const firstParentOrganisation =
    organisaatiot &&
    hierarkia &&
    first(orgOids.filter(org => hierarkia.filter(isParent(org.oid))));

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
