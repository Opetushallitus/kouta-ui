import { createGlobalStyle } from 'styled-components';
import { normalize } from 'polished';

const GlobalStyle = createGlobalStyle`
${normalize()};

body {
  background-color: ${({ theme }) => theme.colors.mainBackground};
  font-family: ${({ theme }) => theme.fonts.main};
}

a {
  text-decoration: none;
}

strong {
  font-weight: 500;
}
`;

export default GlobalStyle;
