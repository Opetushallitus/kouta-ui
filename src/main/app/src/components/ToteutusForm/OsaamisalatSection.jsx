import React from 'react';
import { Field } from 'redux-form';
import styled from 'styled-components';

import ApiAsync from '../ApiAsync';
import { getKoulutusByKoodi } from '../../apiUtils';
import Checkbox from '../Checkbox';
import Typography from '../Typography';
import LanguageSelector from '../LanguageSelector';
import { getLanguageValue } from '../../utils';

const makeOnCheckboxChange = ({ value, onChange, optionValue }) => e => {
  if (e.target.checked) {
    onChange([...value, optionValue]);
  } else {
    onChange(value.filter(v => v !== optionValue));
  }
};

const getKoulutus = args => getKoulutusByKoodi(args);

const OsaamisalaSelection = ({
  options = [],
  onChange = () => {},
  value = [],
}) => (
  <>
    {options.map(({ value: optionValue, label }) => (
      <Checkbox
        key={optionValue}
        checked={value.includes(optionValue)}
        onChange={makeOnCheckboxChange({ value, onChange, optionValue })}
      >
        {label}
      </Checkbox>
    ))}
  </>
);

const renderOsaamisalaSelectionField = ({ input, options }) => {
  return <OsaamisalaSelection {...input} options={options} />;
};

const OsaamisalatContainer = ({ koulutus, language }) => {
  const { osaamisalat = [], nimi } = koulutus;

  const osaamisalaOptions = osaamisalat.map(({ nimi, uri }) => ({
    label: nimi.fi,
    value: uri,
  }));

  return (
    <>
      <Typography variant="h6" marginBottom={1}>
        Valitse osaamisalat
      </Typography>
      <Typography variant="h6" marginBottom={1}>
        {getLanguageValue(nimi, language)}
      </Typography>
      <Field
        name="osaamisalat"
        component={renderOsaamisalaSelectionField}
        options={osaamisalaOptions}
      />
    </>
  );
};

const OsaamisalatAsync = ({ koulutusKoodiUri, language }) => {
  return (
    <ApiAsync
      promiseFn={getKoulutus}
      koodiUri={koulutusKoodiUri}
      watch={koulutusKoodiUri}
    >
      {({ data }) =>
        data ? (
          <OsaamisalatContainer koulutus={data} language={language} />
        ) : null
      }
    </ApiAsync>
  );
};

const OsaamisalatSection = ({ languages = [], koulutusKoodiUri }) => {
  return (
    <LanguageSelector languages={languages} defaultValue="fi">
      {({ value: activeLanguage }) => (
        <OsaamisalatAsync
          language={activeLanguage}
          koulutusKoodiUri={koulutusKoodiUri}
        />
      )}
    </LanguageSelector>
  );
};

export default OsaamisalatSection;
