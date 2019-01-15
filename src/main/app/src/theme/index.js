import { css } from 'styled-components';
import merge from 'lodash/merge';
import get from 'lodash/get';

import { isNumber } from '../utils';

const createHeadingTypography = ({ sizes, fontFamily, color, lineHeight }) => {
  return sizes.reduce((acc, curr, index) => {
    acc[`h${index + 1}`] = {
      color,
      fontFamily,
      fontSize: `${curr}rem`,
      fontWeight: 'normal',
      lineHeight,
    };

    return acc;
  }, {});
};

const getSpacingCss = props => {
  const spacingProps = [
    'marginLeft',
    'marginRight',
    'marginBottom',
    'marginTop',
    'paddingLeft',
    'paddingRight',
    'paddingBottom',
    'paddingTop',
  ];

  const {
    theme: {
      spacing: { unit: spacingUnit },
    },
  } = props;

  return spacingProps.reduce((acc, curr) => {
    if (isNumber(props[curr])) {
      acc[curr] = `${spacingUnit * props[curr]}px`;
    }

    return acc;
  }, {});
};

export const spacingCss = css`
  ${props => getSpacingCss(props)}
`;

export const getThemeProp = path => props => get(props.theme, path);

export const createTheme = (theme = {}) => {
  const textPrimaryColor = '#666666';
  const fontFamily = "'Open Sans', sans-serif";

  const headingTypography = createHeadingTypography({
    sizes: [3, 2.5, 2, 1.5, 1.25, 1],
    fontFamily,
    color: textPrimaryColor,
    lineHeight: 1.2,
  });

  const defaults = {
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
      ...headingTypography,
    },
    palette: {
      border: '#999999',
      text: {
        primary: textPrimaryColor,
      },
      primary: {
        light: '#e0f2fd',
        main: '#2da0c7',
        dark: '#1e7998',
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
