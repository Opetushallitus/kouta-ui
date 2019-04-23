import React, { useMemo, useState, useEffect } from 'react';
import sortBy from 'lodash/sortBy';

import LanguageTabs from './LanguageTabs';
import Spacing from '../Spacing';
import useTranslation from '../useTranslation';

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

const LanguageSelector = ({
  languages = [],
  children = () => null,
  initialLanguage = 'fi',
}) => {
  const [language, setLanguage] = useState(initialLanguage);

  useEffect(() => {
    if (languages.length > 0 && !languages.find(lng => lng === language)) {
      setLanguage(languages[0]);
    }
  }, [languages, language]);

  const { t } = useTranslation();

  const options = useMemo(() => getLanguageOptions({ t, languages }), [
    t,
    languages,
  ]);

  return (
    <>
      <LanguageTabs
        onChange={setLanguage}
        value={language}
        languages={options}
      />
      <Spacing paddingTop={2}>
        {language ? children({ language, value: language }) : null}
      </Spacing>
    </>
  );
};

export default LanguageSelector;
