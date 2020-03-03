import React, { useMemo } from 'react';
import { Field } from 'redux-form';
import styled from 'styled-components';
import stripTags from 'striptags';
import { get, isString, mapValues } from 'lodash';
import useApiAsync from '../useApiAsync';

import {
  getOsaamisalakuvauksetByPerusteId,
  getPerusteById,
} from '../../apiUtils';

import Checkbox from '../Checkbox';
import Typography from '../Typography';
import { getLanguageValue, getTestIdProps } from '../../utils';
import Spacing from '../Spacing';
import Divider from '../Divider';
import AbstractCollapse from '../AbstractCollapse';
import Icon from '../Icon';
import { getThemeProp } from '../../theme';
import useTranslation from '../useTranslation';
import { FormFieldInput } from '../formFields';
import useFieldValue from '../useFieldValue';

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

const getExtendedPeruste = async ({ httpClient, apiUrls, perusteId }) => {
  if (!perusteId) {
    return null;
  }

  const peruste = await getPerusteById({
    httpClient,
    apiUrls,
    perusteId,
  });

  const { osaamisalat } = peruste;

  const osaamisalakuvaukset = await getOsaamisalakuvauksetByPerusteId({
    httpClient,
    apiUrls,
    perusteId,
  });

  const osaamisalatWithDescriptions = osaamisalat.map(osaamisala => ({
    ...osaamisala,
    kuvaus: mapValues(
      get(osaamisalakuvaukset, [osaamisala.uri, 0, 'teksti']) || {},
      v => (isString(v) ? stripTags(v) : v),
    ),
  }));

  return {
    ...peruste,
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
      <div>
        <Checkbox
          key={optionValue}
          name={optionValue}
          checked={value.includes(optionValue)}
          onChange={makeOnCheckboxChange({ value, onChange, optionValue })}
        >
          {label}
        </Checkbox>
      </div>
    ))}
  </div>
);

const renderOsaamisalaSelectionField = ({ input, options }) => {
  return <OsaamisalaSelection {...input} options={options} />;
};

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

const OsaamisalatContainer = ({ peruste, language, name }) => {
  const { nimi, osaamisalat } = peruste;

  const osaamisalaOptions = useMemo(
    () =>
      osaamisalat.map(({ nimi, uri }) => ({
        label: getLanguageValue(nimi, language),
        value: uri,
      })),
    [osaamisalat, language],
  );

  const osaamisalatValue = useFieldValue(`${name}.osaamisalat`);

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
        <OsaamisalatInfoFields
          osaamisalatValue={osaamisalatValue || []}
          osaamisalat={osaamisalat}
          language={language}
          name={name}
        />
      </InfoContainer>
    </>
  );
};

const OsaamisalatSection = ({ language, ePerusteId, name }) => {
  const { data: peruste } = useApiAsync({
    promiseFn: getExtendedPeruste,
    perusteId: ePerusteId,
    watch: ePerusteId,
  });

  return (
    <Container>
      {peruste ? (
        <OsaamisalatContainer
          peruste={peruste}
          language={language}
          name={name}
        />
      ) : null}
    </Container>
  );
};

export default OsaamisalatSection;
