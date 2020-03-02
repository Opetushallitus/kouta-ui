import { useCallback, useContext } from 'react';
import DataLoader from 'dataloader';

import { memoize } from '../../utils';
import useApiAsync from '../useApiAsync';
import UrlContext from '../UrlContext';
import HttpContext from '../HttpContext';
import getOrganisaatiotByOids from '../../utils/organisaatioService/getOrganisaatiotByOids';
import useAuthorizedUser from '../useAuthorizedUser';
import getUserRoles from '../../utils/getUserRoles';
import uniqBy from 'lodash/uniqBy';
import getUserOrganisaatiotWithRoles from '../../utils/getUserOrganisaatiotWithRoles';
import useOrganisaatioHierarkia from '../useOrganisaatioHierarkia';
import cond from 'lodash/cond';
import first from 'lodash/first';

const getOrganisaatioLoader = memoize((httpClient, apiUrls) => {
  return new DataLoader(oids =>
    getOrganisaatiotByOids({ oids, httpClient, apiUrls }).then(
      organisaatiot => {
        return oids.map(
          oid =>
            organisaatiot.find(({ oid: orgOid }) => orgOid === oid) || null,
        );
      },
    ),
  );
});

export const useOrganisaatioLoader = () => {
  const apiUrls = useContext(UrlContext);
  const httpClient = useContext(HttpContext);

  return getOrganisaatioLoader(httpClient, apiUrls);
};

export const useOrganisaatio = oid => {
  const organisaatioLoader = useOrganisaatioLoader();

  const promiseFn = useCallback(
    ({ oid }) => {
      return oid ? organisaatioLoader.load(oid) : Promise.resolve(null);
    },
    [organisaatioLoader],
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
    [organisaatioLoader],
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
  ])(o.oppilaitosTyyppiUri);

const isParent = parentOid => org => org.parentOidPath.includes(parentOid);
const isChild = childOid => org =>
  org.oid === childOid || first(org.children.filter(isChild(childOid)));
//const findOrganisation = oid => org => org.oid ===
const isSameKoulutustyyppi = koulutustyyppi => org =>
  //(console.log(org) && false) ||
  oppilaitostyyppiToKoulutustyyppi(org) === koulutustyyppi ||
  first(org.children.filter(isSameKoulutustyyppi(koulutustyyppi)));

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
        .filter(org => {
          const koulutustyyppi = oppilaitostyyppiToKoulutustyyppi(org);

          return (
            koulutustyyppi &&
            hierarkia.filter(isSameKoulutustyyppi(koulutustyyppi))
          );
        })
        .map(_ => _.oid),
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

  console.log(preferredOrganisaatio);
  return { preferredOrganisaatio };
};

export default useOrganisaatio;
