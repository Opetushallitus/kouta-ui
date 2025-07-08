import {
  themeDecorator,
  makeStoreDecorator,
  makeApiDecorator,
  queryClientDecorator,
  authorizedUserDecorator,
  makeLocalizationDecorator,
  routerDecorator,
} from '#/src/storybookUtils';

export const decorators = [
  themeDecorator,
  makeLocalizationDecorator(),
  makeApiDecorator(),
  makeStoreDecorator(),
  queryClientDecorator,
  authorizedUserDecorator,
  routerDecorator,
];

export const parameters = {
  options: {
    storySort: (a, b) =>
      a.title === b.title
        ? 0
        : a.id.localeCompare(b.id, undefined, { numeric: true }),
  },
};
