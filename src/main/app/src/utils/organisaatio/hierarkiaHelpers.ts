export const flatFilterHierarkia = (hierarkia, filterFn) =>
  hierarkia
    .flatMap(org =>
      [org].concat(flatFilterHierarkia(org.children || [], filterFn))
    )
    .filter(filterFn);

export const flattenHierarkia = org =>
  org?.children
    ? [org].concat(org?.children.flatMap(child => flattenHierarkia(child)))
    : [org];
