export const flattenHierarkia = (org: Organisaatio) =>
  org?.children
    ? [org].concat(org?.children.flatMap(child => flattenHierarkia(child)))
    : [org];

export const flatFilterHierarkia = (
  hierarkia: Array<Organisaatio>,
  filterFn: (org: Organisaatio) => boolean
) => hierarkia.flatMap(flattenHierarkia).filter(filterFn);
