import _fp from 'lodash/fp';

export const flatFilterHierarkia = (hierarkia, filterFn) => {
  return hierarkia.flatMap(org => [
    ...(filterFn(org)
      ? [org]
      : flatFilterHierarkia(org.children || [], filterFn)),
  ]);
};

export const flattenHierarkia = _fp.flatMap(org => [
  org,
  ...flattenHierarkia(org?.children ?? []),
]);
