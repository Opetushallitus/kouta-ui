import { OrganisaatioModel } from '#/src/types/domainTypes';

export const flattenHierarkia: (
  orgs?: Array<OrganisaatioModel>
) => Array<OrganisaatioModel> = orgs =>
  orgs?.flatMap((org: OrganisaatioModel) => [
    org,
    ...flattenHierarkia(org?.children),
  ]) ?? ([] as Array<OrganisaatioModel>);

export const flatFilterHierarkia = (
  hierarkia: Array<OrganisaatioModel> | undefined,
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
