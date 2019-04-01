import React from 'react';
import { Field } from 'redux-form';
import { subscribe } from 'react-contextual';
import memoize from 'memoizee';

import UrlContext from '../UrlContext';
import HttpContext from '../HttpContext';
import Typography from '../Typography';
import LanguageSelector from '../LanguageSelector';
import { AsyncCreatableSelect } from '../Select';
import Spacing from '../Spacing';
import { getAmmattinimikkeetByTerm, getAvainsanatByTerm } from '../../apiUtils';
import useTranslation from '../useTranslation';

const MAX_ITEMS = 5;

const makeLoadAmmattinimikkeet = memoize(
  (httpClient, apiUrls, language) => inputValue => {
    return getAmmattinimikkeetByTerm({
      httpClient,
      apiUrls,
      language,
      term: inputValue,
    }).then(result =>
      result.map(r => ({
        value: r,
        label: r,
      })),
    );
  },
);

const makeLoadAvainsanat = memoize(
  (httpClient, apiUrls, language) => inputValue => {
    return getAvainsanatByTerm({
      httpClient,
      apiUrls,
      language,
      term: inputValue,
    }).then(result =>
      result.map(r => ({
        value: r,
        label: r,
      })),
    );
  },
);

const nop = () => {};

const renderCreatableField = ({ input, ...props }) => {
  const { onChange, ...restInput } = input;

  return (
    <AsyncCreatableSelect
      onChange={value => {
        value.length <= MAX_ITEMS && onChange(value);
      }}
      {...restInput}
      onBlur={nop}
      {...props}
    />
  );
};

const NayttamisTiedotSection = ({ languages, httpClient, apiUrls }) => {
  const { t } = useTranslation();

  return (
    <LanguageSelector languages={languages} defaultValue="fi">
      {({ value: activeLanguage }) => {
        return (
          <>
            <Spacing marginBottom={2}>
              <Typography variant="h6" marginBottom={1}>
                {t('toteutuslomake.ammattinimikkeet')}
              </Typography>
              <Field
                name={`ammattinimikkeet.${activeLanguage}`}
                component={renderCreatableField}
                isMulti
                isClearable
                loadOptions={makeLoadAmmattinimikkeet(
                  httpClient,
                  apiUrls,
                  activeLanguage,
                )}
              />
              <Typography variant="secondary" as="div" marginTop={1}>
                {t('yleiset.voitValitaEnintaan', { lukumaara: MAX_ITEMS })}
              </Typography>
            </Spacing>
            <Spacing>
              <Typography variant="h6" marginBottom={1}>
                {t('toteutuslomake.avainsanat')}
              </Typography>
              <Field
                name={`avainsanat.${activeLanguage}`}
                component={renderCreatableField}
                isMulti
                isClearable
                loadOptions={makeLoadAvainsanat(
                  httpClient,
                  apiUrls,
                  activeLanguage,
                )}
              />
              <Typography variant="secondary" as="div" marginTop={1}>
              {t('yleiset.voitValitaEnintaan', { lukumaara: MAX_ITEMS })}
              </Typography>
            </Spacing>
          </>
        );
      }}
    </LanguageSelector>
  );
};

export default subscribe([UrlContext, HttpContext], (apiUrls, httpClient) => ({
  httpClient,
  apiUrls,
}))(NayttamisTiedotSection);
