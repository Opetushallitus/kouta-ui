import merge from 'lodash/merge';
import get from 'lodash/get';

export const getThemeProp = path => props => get(props.theme, path);

export const createTheme = (theme = {}) => {
  const defaults = {
    typography: {
      fontFamily: 'sans-serif',
      lineHeight: 1.5,
      fontSize: '1rem',
    },
    palette: {
      border: '#999999',
      text: {
        primary: '#666666',
      },
      primary: {
        main: '#2da0c7',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#999999',
        contrastText: '#ffffff',
      },
    },
    spacing: {
      unit: 8,
    },
    shape: {
      borderRadius: '4px',
    },
  };

  return merge({}, defaults, theme);
};

export const defaultTheme = createTheme();

export default defaultTheme;
