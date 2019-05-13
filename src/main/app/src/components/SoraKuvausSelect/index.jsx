import React, { useMemo } from './node_modules/react';

import {
  getFirstLanguageValue,
  createChainedFunction,
  noop,
} from '../../utils';

import useSoraKuvaukset from '../useSoraKuvaukset';
import useLanguage from '../useLanguage';
import Select from '../Select';

const getOptions = (kuvaukset, language) => {
  return kuvaukset.map(({ nimi, id }) => ({
    value: id,
    label: getFirstLanguageValue(nimi, language),
  }));
};

export const SoraKuvausSelect = ({
  reloadOnFocus = false,
  onFocus: onFocusProp = noop,
  ...props
}) => {
  const { soraKuvaukset, reload } = useSoraKuvaukset();
  const language = useLanguage();

  const options = useMemo(
    () => (soraKuvaukset ? getOptions(soraKuvaukset, language) : []),
    [soraKuvaukset, language],
  );

  const onFocus = useMemo(() => {
    return reloadOnFocus
      ? createChainedFunction(() => reload(), onFocusProp)
      : onFocusProp;
  }, [reloadOnFocus, reload, onFocusProp]);

  return <Select options={options} onFocus={onFocus} {...props} />;
};

export default SoraKuvausSelect;
