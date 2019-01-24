import React from 'react';
import ReactInputMask from 'react-input-mask';

import Input from '../Input';

const defaultChildren = props => <Input {...props} />;

const InputMask = ({ children = defaultChildren, ...props }) => (
  <ReactInputMask children={children} {...props} />
);

export default InputMask;