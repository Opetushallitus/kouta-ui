import createUiTheme from '@opetushallitus/virkailija-ui-components/createTheme';
import _ from 'lodash';

const breakpoints = ['576px', '768px', '992px'];

export const getThemeProp =
  (path, modifier = x => x) =>
  props => {
    const value = _.get(props?.theme, path);
    if (_.isUndefined(value)) {
      console.error(`getThemeProp: Theme value at path ${path} is undefined!`);
    }
    return modifier(value);
  };

export const spacing =
  (amount = 1) =>
  ({ theme }) =>
    `${theme.spacing.unit * amount}px`;

export const createTheme = () => {
  let theme = createUiTheme();

  theme = _.merge(theme, {
    breakpoints,
    space: _.range(0, 256, 8),
    colors: {
      white: '#ffffff',
      mainBackground: '#f5f5f5',
      grayLighten5: '#f5f5f5',
      grayLighten6: '#f0f3f7',
      blueLighten4: '#def2ff',
      border: theme.colors.divider,
      text: {
        dark: theme.colors.text.heading,
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
      red: {
        main: '#db2828',
        contrastText: '#ffffff',
      },
    },
    zIndices: {
      homeNavigation: 400,
    },
    shape: {
      borderRadius: `${theme.radii[1]}px`,
    },
    spacing: {
      unit: theme.space[1],
    },
    typography: {
      fontFamily: theme.fonts.main,
      lineHeight: theme.lineHeights.body,
      fontSize: theme.fontSizes.body,
    },
  });

  theme.palette = theme.colors;
  theme.colors.julkaistu = theme.colors.success.main;
  theme.colors.tallennettu = theme.colors.primary.main;
  theme.colors.arkistoitu = theme.colors.yellow.main;
  theme.colors.poistettu = theme.colors.red.main;

  return theme;
};

export const defaultTheme = createTheme();

export default defaultTheme;
