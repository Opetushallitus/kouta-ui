import React, { useContext } from 'react';
import { Field } from 'redux-form';

import UrlContext from '../UrlContext';
import HttpContext from '../HttpContext';
import { AsyncCreatableSelect } from '../Select';
import Spacing from '../Spacing';
import { getAmmattinimikkeetByTerm, getAvainsanatByTerm } from '../../apiUtils';
import useTranslation from '../useTranslation';
import { memoize, getTestIdProps, noop, isArray } from '../../utils';
import { createFormFieldComponent } from '../FormFields';

const CreatableField = createFormFieldComponent(
  AsyncCreatableSelect,
  ({ input: { onChange, ...input }, maxItems, ...props }) => ({
    ...input,
    onBlur: noop,
    onChange: v => isArray(v) && v.length <= maxItems && onChange(v),
    maxItems,
    ...props,
  }),
);

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

const NayttamisTiedotSection = ({ language }) => {
  const { t } = useTranslation();
  const httpClient = useContext(HttpContext);
  const apiUrls = useContext(UrlContext);

  return (
    <>
      <Spacing marginBottom={2}>
        <div {...getTestIdProps('ammattinimikkeetSelect')}>
          <Field
            name={`ammattinimikkeet.${language}`}
            component={CreatableField}
            isMulti
            isClearable
            loadOptions={makeLoadAmmattinimikkeet(
              httpClient,
              apiUrls,
              language,
            )}
            label={t('toteutuslomake.ammattinimikkeet')}
            helperText={t('yleiset.voitValitaEnintaan', {
              lukumaara: MAX_ITEMS,
            })}
            maxItems={MAX_ITEMS}
          />
        </div>
      </Spacing>
      <Spacing>
        <div {...getTestIdProps('avainsanatSelect')}>
          <Field
            name={`avainsanat.${language}`}
            component={CreatableField}
            isMulti
            isClearable
            loadOptions={makeLoadAvainsanat(httpClient, apiUrls, language)}
            label={t('toteutuslomake.avainsanat')}
            helperText={t('yleiset.voitValitaEnintaan', {
              lukumaara: MAX_ITEMS,
            })}
            maxItems={MAX_ITEMS}
          />
        </div>
      </Spacing>
    </>
  );
};

export default NayttamisTiedotSection;
