import React from 'react';
import { Field, formValues } from 'redux-form';
import mapValues from 'lodash/mapValues';

import Spacing from '../Spacing';
import Typography from '../Typography';
import Textarea from '../Textarea';
import LanguageSelector from '../LanguageSelector';
import Select from '../Select';
import { getKoodisto } from '../../apiUtils';
import {
  isArray,
  arrayToTranslationObject,
  getFirstLanguageValue,
} from '../../utils';
import ApiAsync from '../ApiAsync';

const getOsiot = async ({ httpClient, apiUrls }) => {
  const osiot = await getKoodisto({
    koodistoUri: 'koulutuksenjarjestamisenlisaosiot',
    httpClient,
    apiUrls,
  });

  return isArray(osiot)
    ? osiot.map(({ metadata, koodiUri, versio }) => ({
        koodiUri: `${koodiUri}#${versio}`,
        nimi: mapValues(arrayToTranslationObject(metadata), ({ nimi }) => nimi),
      }))
    : [];
};

const getOsiotOptions = osiot =>
  osiot.map(({ nimi, koodiUri }) => ({
    value: koodiUri,
    label: getFirstLanguageValue(nimi),
  }));

const noop = () => {};

const renderSelectField = ({ input, ...props }) => (
  <Select {...input} onBlur={noop} {...props} />
);

const renderTextareaField = ({ input, ...props }) => (
  <Textarea {...input} {...props} />
);

const OsiotFieldsBase = ({ osiot, language }) => {
  const osiotArr = osiot || [];

  return osiotArr.map(({ value, label }, index) => (
    <Spacing marginBottom={index !== osiot.length - 1 ? 2 : 0} key={value}>
      <Typography variant="h6" marginBottom={1}>
        {label}
      </Typography>
      <Field
        name={`osioKuvaukset.${value}.${language}`}
        component={renderTextareaField}
      />
    </Spacing>
  ));
};

const OsiotFields = formValues({ osiot: 'osiot' })(OsiotFieldsBase);

const LisatiedotSection = ({ languages = [] }) => {
  return (
    <LanguageSelector languages={languages} defaultValue="fi">
      {({ value: activeLanguage }) => (
        <>
          <Spacing marginBottom={2}>
            <Typography variant="h6" marginBottom={1}>
              Valitse lisättävä osio
            </Typography>
            <ApiAsync promiseFn={getOsiot}>
              {({ data }) => (
                <Field
                  name="osiot"
                  component={renderSelectField}
                  options={getOsiotOptions(data || [])}
                  isMulti
                />
              )}
            </ApiAsync>
          </Spacing>
          <OsiotFields language={activeLanguage} />
        </>
      )}
    </LanguageSelector>
  );
};

export default LisatiedotSection;
