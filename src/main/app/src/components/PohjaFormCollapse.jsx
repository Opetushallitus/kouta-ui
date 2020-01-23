import React, { useCallback } from 'react';
import { get } from 'lodash';
import FormCollapse from './FormCollapse';
import useFieldValue from './useFieldValue';

export default function({ children, onContinue, onSelectBase, ...props }) {
  const tapa = useFieldValue('pohja.tapa');
  const valinta = useFieldValue('pohja.valinta');

  const onPohjaContinue = useCallback(() => {
    onContinue();
    onSelectBase({
      tapa,
      valinta: get(valinta, 'value'),
    });
  }, [onSelectBase, tapa, valinta, onContinue]);

  return (
    <FormCollapse onContinue={onPohjaContinue} {...props}>
      {children}
    </FormCollapse>
  );
}
