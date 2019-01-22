import React from 'react';
import get from 'lodash/get';

import ApiAsync from '../ApiAsync';

import Select, { Option } from '../NativeSelect';
import { getKoulutuksetByKoulutusTyyppi } from '../../apiUtils';

const getKoulutukset = args => getKoulutuksetByKoulutusTyyppi(args);

const getKoulutusLabel = (koulutus, language) => {
  const translations = koulutus.metadata || [];

  return (
    get(
      translations.find(
        ({ kieli }) => kieli && kieli.toLowerCase() === language,
      ) || translations[0],
      'nimi',
    ) || null
  );
};

const getKoulutusValue = koulutus => `${koulutus.koodiUri}#${koulutus.versio}`;

const KoulutusSelect = ({
  koulutusTyyppi = 'amm',
  language = 'fi',
  value,
  ...props
}) => (
  <ApiAsync
    promiseFn={getKoulutukset}
    watch={koulutusTyyppi}
    koulutusTyyppi={koulutusTyyppi}
  >
    {({ data }) => {
      const koulutukset = data || [];

      return (
        <Select value={value || ''} {...props}>
          <Option value="">Valitse koulutus</Option>
          {koulutukset.map(koulutus => (
            <Option
              key={getKoulutusValue(koulutus)}
              value={getKoulutusValue(koulutus)}
            >
              {getKoulutusLabel(koulutus, language)}
            </Option>
          ))}
        </Select>
      );
    }}
  </ApiAsync>
);

export default KoulutusSelect;
