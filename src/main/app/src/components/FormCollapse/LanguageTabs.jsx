import React, { useMemo } from 'react';
import sortBy from 'lodash/sortBy';

import useTranslation from '../useTranslation';
import Tabs, { Tab } from '../Tabs';

const sortOrder = ['fi', 'sv', 'en'];

const getLanguageOptions = ({ languages = [], t }) => {
  const labelByValue = {
    fi: t('yleiset.suomeksi'),
    sv: t('yleiset.ruotsiksi'),
    en: t('yleiset.englanniksi'),
  };

  return sortBy(
    languages.map(item => {
      return {
        label: labelByValue[item] || item,
        value: item,
      };
    }),
    ({ value }) => sortOrder.indexOf(value),
  );
};

const LanguageTabs = ({
  languages = [],
  language = 'fi',
  onChange = () => {},
}) => {
  const { t } = useTranslation();

  const options = useMemo(() => getLanguageOptions({ t, languages }), [
    t,
    languages,
  ]);

  return (
    <Tabs value={language} onChange={onChange}>
      {options.map(({ label, value }) => (
        <Tab value={value} key={value}>
          {label}
        </Tab>
      ))}
    </Tabs>
  );
};

export default LanguageTabs;
