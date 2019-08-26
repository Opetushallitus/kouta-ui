import get from 'lodash/get';
import { generateMedia } from 'styled-media-query';

const breakpoints = ['576px', '768px', '992px'];

export const media = generateMedia({
  large: breakpoints[2],
  medium: breakpoints[1],
  small: breakpoints[0],
});

const createHeadingTypography = ({
  sizes,
  fontFamily,
  color,
  lineHeight,
  fontWeight,
}) => {
  return sizes.reduce((acc, curr, index) => {
    acc[`h${index + 1}`] = {
      color,
      fontFamily,
      fontSize: `${curr}rem`,
      fontWeight,
      lineHeight,
    };

    return acc;
  }, {});
};

export const getThemeProp = path => props => get(props.theme, path);

export const spacing = (amount = 1) => ({ theme }) =>
  `${theme.spacing.unit * amount}px`;

export const createTheme = () => {
  const textPrimaryColor = '#666666';
  const textSecondaryColor = '#a6a6a6';
  const textDarkColor = '#2a2a2a';
  const fontFamily = "'Roboto', sans-serif";

  const fontWeights = {
    bold: '500',
    regular: '400',
  };

  const fonts = {
    main: fontFamily,
  };

  const headingTypography = createHeadingTypography({
    sizes: [3, 2.5, 2, 1.5, 1.25, 1],
    fontFamily,
    color: textDarkColor,
    lineHeight: 1.2,
    fontWeight: fontWeights.bold,
  });

  const colors = {
    white: '#ffffff',
    border: '#cccccc',
    divider: '#cccccc',
    mainBackground: '#f5f5f5',
    text: {
      primary: textPrimaryColor,
      secondary: textSecondaryColor,
      dark: textDarkColor,
    },
    primary: {
      light: '#e0f2fd',
      main: '#159ecb',
      dark: '#2a2a2a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#999999',
      contrastText: '#ffffff',
    },
    success: {
      main: '#43a047',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#de9a06',
      contrastText: '#ffffff',
    },
    danger: {
      main: '#e05055',
      contrastText: '#ffffff',
    },
    orange: {
      main: '#e77e22',
      contrastText: '#ffffff',
    },
    yellow: {
      main: '#ffd024',
      contrastText: '#ffffff',
    },
  };

  colors.julkaistu = colors.success.main;
  colors.tallennettu = colors.primary.main;
  colors.arkistoitu = colors.yellow.main;

  const radii = [0, 4];

  const theme = {
    breakpoints,
    typography: {
      fontFamily,
      lineHeight: 1.5,
      fontSize: '1rem',
      body: {
        fontSize: '1rem',
        color: textPrimaryColor,
        lineHeight: 1.5,
        fontFamily,
      },
      secondary: {
        fontSize: '0.85rem',
        color: textSecondaryColor,
        lineHeight: 1.5,
        fontFamily,
      },
      ...headingTypography,
    },
    colors,
    spacing: {
      unit: 8,
    },
    space: [0, 8, 16, 24, 32, 40, 48, 56, 64],
    shape: {
      borderRadius: '4px',
    },
    zIndices: {
      homeNavigation: 99,
      modal: 999,
    },
    contentMaxWidth: '1200px',
    radii,
    disabled: {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
    fontWeights,
    fonts,
    shadows: ['none', '0 2px 8px rgba(0,0,0,0.15)'],
  };

  theme.palette = theme.colors; // Alias to ensure backwards compatibility

  return theme;
};

export const defaultTheme = createTheme();

export default defaultTheme;
