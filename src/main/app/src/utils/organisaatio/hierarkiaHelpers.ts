import { OrganisaatioModel } from '#/src/types/domainTypes';

export const flattenHierarkia = (orgs: Array<OrganisaatioModel>) =>
  orgs.flatMap((org: OrganisaatioModel) => [
    org,
    ...flattenHierarkia(org?.children ?? []),
  ]);

export const flatFilterHierarkia = (
  hierarkia: Array<OrganisaatioModel>,
  filterFn: (org: OrganisaatioModel) => boolean
) => flattenHierarkia(hierarkia).filter(filterFn);

export const filterHierarkiaUtilizingChildrenWhenParentDoesNotMatch = (
  hierarkia,
  filterFn
) =>
  hierarkia.flatMap(org => [
    ...(filterFn(org)
      ? [org]
      : filterHierarkiaUtilizingChildrenWhenParentDoesNotMatch(
          org.children || [],
          filterFn
        )),
  ]);
