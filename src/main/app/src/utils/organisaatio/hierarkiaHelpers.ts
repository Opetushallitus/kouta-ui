export const flattenHierarkia = (orgs: Array<Organisaatio>) =>
  orgs.flatMap((org: Organisaatio) => [
    org,
    ...flattenHierarkia(org?.children ?? []),
  ]);

export const flatFilterHierarkia = (
  hierarkia: Array<Organisaatio>,
  filterFn: (org: Organisaatio) => boolean
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
