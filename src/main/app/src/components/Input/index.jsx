import styled from 'styled-components';

import { getThemeProp } from '../../theme';

const Input = styled.input`
  border: 1px solid ${getThemeProp('palette.border')};
  color: ${getThemeProp('palette.text.primary')};
  font-family: ${getThemeProp('typography.fontFamily')};
  line-height: 1.5;
  border-radius: ${getThemeProp('shape.borderRadius')};
  outline: none;
  padding: 6px 12px;
  font-size: 1rem;
  transition: border-color 0.25s, box-shadow 0.25s;
  display: block;
  width: 100%;
  box-sizing: border-box;
  background-color: white;

  &:focus {
    border-color: ${getThemeProp('palette.primary.main')};
    box-shadow: 0 0 0 1px ${getThemeProp('palette.primary.main')};
  }
`;

export default Input;
