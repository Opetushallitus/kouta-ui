import React, { useMemo } from 'react';
import { Field, formValues } from 'redux-form';
import styled from 'styled-components';
import stripTags from 'striptags';
import mapValues from 'lodash/mapValues';
import get from 'lodash/get';

import useApiAsync from '../useApiAsync';

import {
  getKoulutusByKoodi,
  getOsaamisalakuvauksetByPerusteId,
} from '../../apiUtils';

import Checkbox from '../Checkbox';
import Typography from '../Typography';
import { getLanguageValue, isString, getTestIdProps } from '../../utils';
import Spacing from '../Spacing';
import Divider from '../Divider';
import AbstractCollapse from '../AbstractCollapse';
import Icon from '../Icon';
import { getThemeProp } from '../../theme';
import useTranslation from '../useTranslation';
import { FormFieldInput } from '../FormFields';

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

const OsaamisalaDetailsToggle = ({ open, onToggle, ...props }) => {
  return (
    <OsaamisalaDetailsToggleContainer onClick={onToggle} {...props}>
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
  const { osaamisalat = [] } = koulutus;

  if (!koulutus.perusteId) {
    return {
      koulutus,
      osaamisalat,
    };
  }

  const osaamisalakuvaukset = await getOsaamisalakuvauksetByPerusteId({
    httpClient,
    apiUrls,
    perusteId: koulutus.perusteId,
  });

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
  <div {...getTestIdProps('osaamisalaSelection')}>
    {options.map(({ value: optionValue, label }) => (
      <Checkbox
        key={optionValue}
        name={optionValue}
        checked={value.includes(optionValue)}
        onChange={makeOnCheckboxChange({ value, onChange, optionValue })}
      >
        {label}
      </Checkbox>
    ))}
  </div>
);

const renderOsaamisalaSelectionField = ({ input, options }) => {
  return <OsaamisalaSelection {...input} options={options} />;
};

const OsaamisalatFieldValue = formValues(({ name }) => ({
  osaamisalat: `${name}.osaamisalat`,
}))(({ osaamisalat, children }) => children({ osaamisalat }));

const OsaamisalaDetails = ({ osaamisala, language, name }) => {
  const { t } = useTranslation();

  return (
    <Spacing marginTop={2}>
      <Spacing
        marginBottom={2}
        {...getTestIdProps(`osaamisalaLinkki.${osaamisala.uri}`)}
      >
        <Field
          name={`${name}.osaamisalaLinkit.${osaamisala.uri}.${language}`}
          component={FormFieldInput}
          label={t('yleiset.linkki')}
        />
      </Spacing>
      <Spacing {...getTestIdProps(`osaamisalaOtsikko.${osaamisala.uri}`)}>
        <Field
          name={`${name}.osaamisalaLinkkiOtsikot.${osaamisala.uri}.${language}`}
          component={FormFieldInput}
          label={t('yleiset.linkinOtsikko')}
        />
      </Spacing>
    </Spacing>
  );
};

const OsaamisalatInfoFields = ({
  osaamisalatValue,
  osaamisalat,
  language,
  name,
}) => {
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
              <OsaamisalaDetails
                osaamisala={osaamisala}
                language={language}
                name={name}
              />
            }
          >
            {({ open, onToggle }) => (
              <OsaamisalaDetailsToggle
                open={open}
                onToggle={onToggle}
                {...getTestIdProps(`osaamisalaToggle.${uri}`)}
              />
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

const OsaamisalatContainer = ({ osaamisalat, koulutus, language, name }) => {
  const { nimi } = koulutus;

  const osaamisalaOptions = useMemo(
    () =>
      osaamisalat.map(({ nimi, uri }) => ({
        label: nimi.fi,
        value: uri,
      })),
    [osaamisalat],
  );

  return (
    <>
      <SelectionContainer>
        <Typography variant="h6" marginBottom={1}>
          {getLanguageValue(nimi, language)}
        </Typography>
        <Field
          name={`${name}.osaamisalat`}
          component={renderOsaamisalaSelectionField}
          options={osaamisalaOptions}
        />
      </SelectionContainer>
      <InfoContainer>
        <OsaamisalatFieldValue name={name}>
          {({ osaamisalat: osaamisalatValue }) => (
            <OsaamisalatInfoFields
              osaamisalatValue={osaamisalatValue || []}
              osaamisalat={osaamisalat}
              language={language}
              name={name}
            />
          )}
        </OsaamisalatFieldValue>
      </InfoContainer>
    </>
  );
};

const OsaamisalatSection = ({ language, koulutusKoodiUri, name }) => {
  const { data } = useApiAsync({
    promiseFn: getOsaamisalat,
    koodiUri: koulutusKoodiUri,
    watch: koulutusKoodiUri,
  });

  return (
    <Container>
      {data ? (
        <OsaamisalatContainer
          osaamisalat={data.osaamisalat}
          koulutus={data.koulutus}
          language={language}
          name={name}
        />
      ) : null}
    </Container>
  );
};

export default OsaamisalatSection;
