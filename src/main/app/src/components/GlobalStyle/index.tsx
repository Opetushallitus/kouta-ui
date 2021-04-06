import { normalize } from 'polished';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
${normalize()};

html {
  overflow: hidden;
}

body {
  position: absolute;
  overflow-y: auto;
  height: 100%;
  width: 100%;
}

#root {
  background-color: ${({ theme }) => theme.colors.mainBackground};
}

body > :not(#raamit_app_root) {
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
