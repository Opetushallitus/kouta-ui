import React from 'react';
import { Field, formValues } from 'redux-form';
import styled from 'styled-components';
import stripTags from 'striptags';
import mapValues from 'lodash/mapValues';
import get from 'lodash/get';

import ApiAsync from '../ApiAsync';

import {
  getKoulutusByKoodi,
  getOsaamisalakuvauksetByPerusteId,
} from '../../apiUtils';

import Checkbox from '../Checkbox';
import Typography from '../Typography';
import LanguageSelector from '../LanguageSelector';
import { getLanguageValue, isString } from '../../utils';
import Spacing from '../Spacing';
import Input from '../Input';
import Divider from '../Divider';
import AbstractCollapse from '../AbstractCollapse';
import Icon from '../Icon';
import { getThemeProp } from '../../theme';

const renderInputField = ({ input, type = 'text' }) => (
  <Input {...input} type={type} />
);

const Container = styled.div`
  display: flex;
`;

const SelectionContainer = styled.div`
  flex: 0;
  flex-basis: 40%;
`;

const InfoContainer = styled.div`
  flex: 1;
  padding-left: ${({ theme }) => theme.spacing.unit * 2}px;
`;

const OsaamisalaDetailsToggleContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  ${getThemeProp('typography.body')};
`;

const OsaamisalaDetailsToggle = ({ open, onToggle }) => {
  return (
    <OsaamisalaDetailsToggleContainer onClick={onToggle}>
      <Icon type={open ? 'arrow_drop_down' : 'arrow_right'} />
      <Typography>
        {open ? 'Sulje tarkempi kuvaus' : 'Tarkenna kuvausta'}
      </Typography>
    </OsaamisalaDetailsToggleContainer>
  );
};

const makeOnCheckboxChange = ({ value, onChange, optionValue }) => e => {
  if (e.target.checked) {
    onChange([...value, optionValue]);
  } else {
    onChange(value.filter(v => v !== optionValue));
  }
};

const getOsaamisalat = async ({ httpClient, apiUrls, koodiUri }) => {
  const koulutus = await getKoulutusByKoodi({ httpClient, apiUrls, koodiUri });

  const osaamisalakuvaukset = await getOsaamisalakuvauksetByPerusteId({
    httpClient,
    apiUrls,
    perusteId: koulutus.perusteId,
  });

  const { osaamisalat = [] } = koulutus;

  const osaamisalatWithDescriptions = osaamisalat.map(osaamisala => ({
    ...osaamisala,
    kuvaus: mapValues(
      get(osaamisalakuvaukset, [osaamisala.uri, 0, 'teksti']) || {},
      v => (isString(v) ? stripTags(v) : v),
    ),
  }));

  return {
    koulutus,
    osaamisalat: osaamisalatWithDescriptions,
  };
};

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

const OsaamisalatFieldValue = formValues({
  osaamisalat: 'osaamisalat',
})(({ osaamisalat, children }) => children({ osaamisalat }));

const OsaamisalaDetails = ({ osaamisala, language }) => {
  return (
    <Spacing marginTop={2}>
      <Spacing marginBottom={2}>
        <Typography variant="body" as="div" marginBottom={1}>
          Lisää linkki
        </Typography>
        <Field
          name={`osaamisalaLinkit.${osaamisala.uri}.${language}`}
          component={renderInputField}
        />
      </Spacing>
      <Spacing>
        <Typography variant="body" as="div" marginBottom={1}>
          Linkin otsikko
        </Typography>
        <Field
          name={`osaamisalaLinkkiOtsikot.${osaamisala.uri}.${language}`}
          component={renderInputField}
        />
      </Spacing>
    </Spacing>
  );
};

const OsaamisalatInfoFields = ({ osaamisalatValue, osaamisalat, language }) => {
  const activeOsaamisalat = osaamisalat.filter(({ uri }) =>
    osaamisalatValue.includes(uri),
  );

  return activeOsaamisalat.map((osaamisala, index) => {
    const { nimi, kuvaus, uri } = osaamisala;
  
    return (
      <div key={uri}>
        <Spacing key={uri}>
          <Spacing marginBottom={2}>
            <Typography variant="h6" marginBottom={1}>
              {getLanguageValue(nimi, language)}
            </Typography>
            <Typography>{getLanguageValue(kuvaus, language)}</Typography>
          </Spacing>

          <AbstractCollapse
            content={
              <OsaamisalaDetails osaamisala={osaamisala} language={language} />
            }
          >
            {({ open, onToggle }) => (
              <OsaamisalaDetailsToggle open={open} onToggle={onToggle} />
            )}
          </AbstractCollapse>
        </Spacing>
        {index < activeOsaamisalat.length - 1 ? (
          <Divider marginTop={3} marginBottom={3} />
        ) : null}
      </div>
    );
  });
};

const OsaamisalatContainer = ({ osaamisalat, koulutus, language }) => {
  const { nimi } = koulutus;

  const osaamisalaOptions = osaamisalat.map(({ nimi, uri }) => ({
    label: nimi.fi,
    value: uri,
  }));

  return (
    <>
      <SelectionContainer>
        <Typography variant="h6" marginBottom={1}>
          {getLanguageValue(nimi, language)}
        </Typography>
        <Field
          name="osaamisalat"
          component={renderOsaamisalaSelectionField}
          options={osaamisalaOptions}
        />
      </SelectionContainer>
      <InfoContainer>
        <OsaamisalatFieldValue>
          {({ osaamisalat: osaamisalatValue }) => (
            <OsaamisalatInfoFields
              osaamisalatValue={osaamisalatValue || []}
              osaamisalat={osaamisalat}
              language={language}
            />
          )}
        </OsaamisalatFieldValue>
      </InfoContainer>
    </>
  );
};

const OsaamisalatAsync = ({ koulutusKoodiUri, language }) => {
  return (
    <ApiAsync
      promiseFn={getOsaamisalat}
      koodiUri={koulutusKoodiUri}
      watch={koulutusKoodiUri}
    >
      {({ data }) =>
        data ? (
          <OsaamisalatContainer
            osaamisalat={data.osaamisalat}
            koulutus={data.koulutus}
            language={language}
          />
        ) : null
      }
    </ApiAsync>
  );
};

const OsaamisalatSection = ({ languages = [], koulutusKoodiUri }) => {
  return (
    <LanguageSelector languages={languages} defaultValue="fi">
      {({ value: activeLanguage }) => (
        <Container>
          <OsaamisalatAsync
            language={activeLanguage}
            koulutusKoodiUri={koulutusKoodiUri}
          />
        </Container>
      )}
    </LanguageSelector>
  );
};

export default OsaamisalatSection;
