import React from 'react';
import Icon from '../Icon';
import { Spring } from 'react-spring';

export const DropdownIcon = ({
  open = false,
  icon = 'arrow_drop_down',
  style = {},
  ...props
}) => {
  return (
    <Spring
      to={{ transform: open ?  'rotate(180deg)' : 'rotate(0deg)' }}
    >
      {({ transform }) => (
        <Icon type={icon} {...props} style={{ ...style, transform }} />
      )}
    </Spring>
  );
};

export default DropdownIcon;
