import createUiTheme from '@opetushallitus/virkailija-ui-components/createTheme';
import _ from 'lodash';
import { mix } from 'polished';

const breakpoints = ['576px', '768px', '992px'];

// Generates all valid dot-separated key paths into T (up to 5 levels, skipping arrays).
type DotPath<T, D extends Array<number> = []> = D['length'] extends 5
  ? never
  : T extends ReadonlyArray<unknown>
    ? never
    : T extends object
      ? {
          [K in keyof T & string]: K | `${K}.${DotPath<T[K], [0, ...D]>}`;
        }[keyof T & string]
      : never;

// Resolves the value type at a dot-separated path P within T.
type PathValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;

export const getThemeProp =
  <P extends DotPath<Theme>, R = PathValue<Theme, P>>(
    path: P,
    modifier: (value: PathValue<Theme, P>) => R = x => x as unknown as R
  ) =>
  ({ theme }: { theme: Theme }): R => {
    const value = _.get(theme, path) as PathValue<Theme, P>;
    if (_.isUndefined(value)) {
      console.error(`getThemeProp: Theme value at path ${path} is undefined!`);
    }
    return modifier(value);
  };

export const spacing =
  (amount = 1) =>
  ({ theme }: { theme: Theme }) =>
    `${theme.spacing.unit * amount}px`;

export const createTheme = () => {
  const base = createUiTheme();

  const theme = _.merge(base, {
    breakpoints,
    space: _.range(0, 256, 8),
    colors: {
      white: '#ffffff',
      mainBackground: '#f5f5f5',
      grayLighten5: '#f5f5f5',
      grayLighten6: '#f0f3f7',
      blueLighten4: '#def2ff',
      visitedLink: mix(0.5, 'purple', base.colors.primary.main),
      border: base.colors.divider,
      text: {
        dark: base.colors.text.heading,
      },
      primary: {
        light: '#e0f2fd',
      },
      orange: {
        main: '#e77e22',
        contrastText: '#ffffff',
      },
      yellow: {
        main: '#ffd024',
        contrastText: '#ffffff',
      },
      mediumYellow: {
        main: '#fbdb04',
        contrastText: '#ffffff',
      },
      red: {
        main: '#db2828',
        contrastText: '#ffffff',
      },
      julkaistu: base.colors.success.main,
      tallennettu: base.colors.primary.main,
      arkistoitu: '#e77e22',
      poistettu: '#db2828',
    },
    shape: {
      borderRadius: `${base.radii[1]}px`,
    },
    spacing: {
      unit: base.space[1],
    },
    typography: {
      fontFamily: base.fonts.main,
      lineHeight: base.lineHeights.body,
      fontSize: base.fontSizes.body,
    },
  });

  return {
    ...theme,
    palette: theme.colors,
  };
};

export const defaultTheme = createTheme();

export type Theme = typeof defaultTheme;

export default defaultTheme;
