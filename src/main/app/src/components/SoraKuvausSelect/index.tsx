import React, { useMemo } from 'react';
import { noop } from 'lodash';
import { createChainedFunction } from '#/src/utils';
import useSoraKuvausOptions from '#/src/hooks/useSoraKuvausOptions';
import Select from '#/src/components/Select';

export const SoraKuvausSelect = ({
  reloadOnFocus = false,
  onFocus: onFocusProp = noop,
  organisaatioOid,
  ...props
}) => {
  const { options, reload } = useSoraKuvausOptions({ organisaatioOid });

  const onFocus = useMemo(() => {
    return reloadOnFocus
      ? createChainedFunction(() => reload(), onFocusProp)
      : onFocusProp;
  }, [reloadOnFocus, reload, onFocusProp]);

  return <Select options={options} onFocus={onFocus} {...props} />;
};

export default SoraKuvausSelect;
