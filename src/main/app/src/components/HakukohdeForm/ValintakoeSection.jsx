import React, { Fragment } from 'react';
import styled, { css } from 'styled-components';
import { Field, FormSection, formValues } from 'redux-form';
import mapValues from 'lodash/mapValues';

import Typography from '../Typography';
import Spacing from '../Spacing';
import LanguageSelector from '../LanguageSelector';
import CheckboxGroup from '../CheckboxGroup';
import AbstractCollapse from '../AbstractCollapse';
import { isArray, getFirstLanguageValue } from '../../utils';
import Icon from '../Icon';
import { spacing, getThemeProp } from '../../theme';
import ValintakoeList from './ValintakoeList';
import Divider from '../Divider';
import { getKoodisto } from '../../apiUtils';
import { arrayToTranslationObject } from '../../utils';
import ApiAsync from '../ApiAsync';

const getValintakoetyypit = async ({ httpClient, apiUrls }) => {
  const valintakoetyypit = await getKoodisto({
    httpClient,
    apiUrls,
    koodistoUri: 'valintakokeentyyppi',
  });

  return isArray(valintakoetyypit)
    ? valintakoetyypit.map(({ metadata, koodiUri, versio }) => ({
        koodiUri: `${koodiUri}#${versio}`,
        nimi: mapValues(arrayToTranslationObject(metadata), ({ nimi }) => nimi),
      }))
    : [];
};

const getValintakoetyypitOptions = valintakoetyypit => [
  ...valintakoetyypit.map(({ koodiUri, nimi }) => ({
    value: koodiUri,
    label: getFirstLanguageValue(nimi),
  })),
  { value: 'ei_valintakoetta', label: 'Ei valintakoetta' },
];

const Container = styled.div`
  display: flex;
`;

const TypeContainer = styled.div`
  flex: 0;
  flex-basis: 30%;
`;

const ItemContainer = styled.div`
  flex: 1;
`;

const ItemTitleContainer = styled.div`
  display: flex;
  align-items: center;
  color: ${getThemeProp('palette.text.primary')};
  cursor: pointer;

  ${({ open }) =>
    open &&
    css`
      margin-bottom: ${spacing(1)};
    `}
`;

const renderCheckboxGroupField = ({ input, options }) => (
  <CheckboxGroup {...input} options={options} />
);

const TypesFieldValue = formValues({
  types: 'types',
})(({ types, children }) => children({ types }));

const ValintakoeType = ({ title, value, language }) => {
  const content = (
    <FormSection name={value}>
      <ValintakoeList language={language} />
    </FormSection>
  );

  return (
    <Spacing marginBottom={2}>
      <AbstractCollapse content={content} defaultOpen={true}>
        {({ open, onToggle }) => (
          <ItemTitleContainer open={open}>
            <Icon type={open ? 'arrow_drop_down' : 'arrow_right'} />
            <Typography variant="h6" onClick={onToggle}>
              {title}
            </Typography>
          </ItemTitleContainer>
        )}
      </AbstractCollapse>
    </Spacing>
  );
};

const ValintakoeTypeList = ({ types, options, language }) => {
  const activeTypes = options.filter(
    ({ value }) => value !== 'ei_valintakoetta' && types.includes(value),
  );

  return (
    <FormSection name="kokeet">
      {activeTypes.map(({ value, label }, index) => (
        <Fragment key={value}>
          <ValintakoeType
            title={label}
            value={value}
            key={value}
            language={language}
          />
          {index < activeTypes.length - 1 ? (
            <Divider marginTop={3} marginBottom={3} />
          ) : null}
        </Fragment>
      ))}
    </FormSection>
  );
};

const ValintakoeSection = ({ languages }) => {
  return (
    <LanguageSelector languages={languages} defaultValue="fi">
      {({ value: activeLanguage }) => (
        <ApiAsync promiseFn={getValintakoetyypit}>
          {({ data }) => {
            const options = data ? getValintakoetyypitOptions(data) : [];

            return (
              <Container>
                <TypeContainer>
                  <Typography variant="h6" marginBottom={1}>
                    Valitse valintakokeen tyyppi
                  </Typography>
                  <Field
                    name="types"
                    component={renderCheckboxGroupField}
                    options={options}
                  />
                </TypeContainer>
                <ItemContainer>
                  <TypesFieldValue>
                    {({ types }) =>
                      isArray(types) ? (
                        <ValintakoeTypeList
                          types={types}
                          language={activeLanguage}
                          options={options}
                        />
                      ) : null
                    }
                  </TypesFieldValue>
                </ItemContainer>
              </Container>
            );
          }}
        </ApiAsync>
      )}
    </LanguageSelector>
  );
};

export default ValintakoeSection;
