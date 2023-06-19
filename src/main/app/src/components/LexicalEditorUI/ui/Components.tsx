import styled from 'styled-components';

import { Icon } from '#/src/components/virkailija';
import { getThemeProp } from '#/src/theme';

export const StyledIcon = styled(Icon)`
  color: ${getThemeProp('palette.text.primary')};
  font-size: 1.4rem;
  padding-right: 2px;
`;

export const DropDownContainer = styled.div`
  z-index: 10;
  display: block;
  position: fixed;
  box-shadow: 0 12px 28px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  min-height: 40px;
  background-color: #fff;

  button.item i {
    opacity: 0.6;
  }

  button.item.dropdown-item-active {
    background-color: rgba(223, 232, 250, 0.3);
  }

  button.item.dropdown-item-active i {
    opacity: 1;
  }
`;
