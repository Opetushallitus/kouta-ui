import {
  themeDecorator,
  makeLocalizationDecorator,
  makeStoreDecorator,
  makeApiDecorator,
  queryClientDecorator,
  authorizedUserDecorator,
} from '#/src/storybookUtils';

export const decorators = [
  themeDecorator,
  makeLocalizationDecorator(),
  makeApiDecorator(),
  makeStoreDecorator(),
  queryClientDecorator,
  authorizedUserDecorator,
];

export const parameters = {
  options: {
    storySort: (a, b) =>
      a[1].kind === b[1].kind
        ? 0
        : a[1].id.localeCompare(b[1].id, undefined, { numeric: true }),
  },
};
