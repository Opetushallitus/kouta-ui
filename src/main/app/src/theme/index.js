import merge from 'lodash/merge';

export const createTheme = (theme = {}) => {
  const defaults = {
    typography: {
      fontFamily: 'sans-serif',
      lineHeight: 1.5,
      fontSize: '1rem',
    },
    palette: {
      text: {
        primary: 'black',
      },
      primary: {
        main: '#ffffff',
      },
    },
    spacing: {
      unit: 8,
    },
  };

  return merge({}, defaults, theme);
};

export const defaultTheme = createTheme();

export default defaultTheme;
