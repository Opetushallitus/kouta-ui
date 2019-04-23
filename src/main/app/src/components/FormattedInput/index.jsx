import React, { useRef, useEffect } from 'react';
import Cleave from 'cleave.js';
import pick from 'lodash/pick';
import omit from 'lodash/omit';

import Input from '../Input';
import { noop } from '../../utils';

const cleaveProps = ['time', 'timePattern'];

export const FormattedInput = ({ onChange = () => {}, value, ...props }) => {
  const inputRef = useRef();
  const cleaveRef = useRef();

  useEffect(() => {
    cleaveRef.current = new Cleave(inputRef.current, {
      ...pick(props, cleaveProps),
    });

    if (value) {
      cleaveRef.current.setRawValue(value);
    }

    return () => {
      cleaveRef.current.destroy();
    };
  });

  useEffect(() => {
    cleaveRef.current.properties.onValueChanged = onChange;
  }, [onChange, value]);

  return (
    <Input
      onChange={noop}
      {...omit(props, [...cleaveProps, 'value'])}
      ref={inputRef}
    />
  );
};

export default FormattedInput;
