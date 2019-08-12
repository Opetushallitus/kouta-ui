import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
body {
  background-color: ${({ theme }) => theme.colors.mainBackground};
}

a {
  text-decoration: none;
}

strong {
  font-weight: 500;
}
`;

export default GlobalStyle;
