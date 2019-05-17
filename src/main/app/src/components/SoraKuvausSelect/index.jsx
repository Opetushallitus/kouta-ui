import React, { useMemo } from 'react';

import { createChainedFunction, noop } from '../../utils';
import useSoraKuvausOptions from '../useSoraKuvausOptions';
import Select from '../Select';

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
