import React from 'react';

import _ from 'lodash';

import Select from '#/src/components/Select';
import useEntityOptions from '#/src/hooks/useEntityOptionsHook';
import { useSoraKuvaukset } from '#/src/utils/soraKuvaus/getSoraKuvaukset';

export const SoraKuvausSelect = ({
  reloadOnFocus = false,
  onFocus: onFocusProp = _.noop,
  organisaatioOid,
  ...props
}) => {
  const { soraKuvaukset } = useSoraKuvaukset({ organisaatioOid });

  const options = useEntityOptions(soraKuvaukset);

  return <Select options={options} {...props} />;
};

export default SoraKuvausSelect;
