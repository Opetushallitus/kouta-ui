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
  display: flex;
  flex-direction: column;
}

#root {
  background-color: ${({ theme }) => theme.colors.mainBackground};
  flex-grow: 1;
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
