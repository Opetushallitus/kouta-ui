import React, { useMemo } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { Tab, Tabs } from '#/src/components/virkailija';

const sortOrder = ['fi', 'sv', 'en', 'muu'];

const getLanguageOptions = ({ languages = [], t }) => {
  const labelByValue = {
    fi: t('yleiset.suomeksi'),
    sv: t('yleiset.ruotsiksi'),
    en: t('yleiset.englanniksi'),
  };

  return _.sortBy(
    languages.map(item => {
      return {
        label: labelByValue[item] || item,
        value: item,
      };
    }),
    ({ value }) => sortOrder.indexOf(value)
  );
};

const onTabClick = e => e.stopPropagation();

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
        <Tab value={value} key={value} onClick={onTabClick}>
          {label}
        </Tab>
      ))}
    </Tabs>
  );
};

export default LanguageTabs;
