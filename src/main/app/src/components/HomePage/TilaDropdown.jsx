import React from 'react';
import styled from 'styled-components';

import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownMenuItem,
} from '../Dropdown';
import { JULKAISUTILA } from '../../constants';
import TilaLabel from './TilaLabel';
import Icon from '../Icon';

const TilaItem = styled(DropdownMenuItem)`
  cursor: pointer;
`;

const DropdownContainer = styled.div`
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
`;

export const TilaDropdown = ({ onChange, value }) => {
  const tilat = Object.values(JULKAISUTILA)
    .filter(v => v !== value)

  const overlay = (
    <DropdownMenu>
      {tilat.map(tila => (
        <TilaItem onClick={() => onChange(tila)} key={tila}>
          <TilaLabel tila={tila} />
        </TilaItem>
      ))}
    </DropdownMenu>
  );

  return (
    <UncontrolledDropdown
      overlay={overlay}
      portalTarget={document.body}
      overflow
    >
      {({ ref, onToggle, visible }) => (
        <DropdownContainer ref={ref} onClick={onToggle} title="Muuta tilaa">
          <TilaLabel tila={value} />{' '}
          <Icon type={visible ? 'arrow_drop_up' : 'arrow_drop_down'} />
        </DropdownContainer>
      )}
    </UncontrolledDropdown>
  );
};

export default TilaDropdown;
