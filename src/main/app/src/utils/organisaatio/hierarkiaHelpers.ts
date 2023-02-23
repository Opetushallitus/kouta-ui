export const flatFilterHierarkia = (
  hierarkia: Array<Organisaatio>,
  filterFn: (org: Organisaatio) => boolean
) =>
  hierarkia
    .flatMap(org =>
      [org].concat(flatFilterHierarkia(org.children || [], filterFn))
    )
    .filter(filterFn);

export const flattenHierarkia = (org: Organisaatio) =>
  org?.children
    ? [org].concat(org?.children.flatMap(child => flattenHierarkia(child)))
    : [org];
