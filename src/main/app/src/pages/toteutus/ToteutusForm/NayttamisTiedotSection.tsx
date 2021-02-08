import React from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { createFormFieldComponent } from '#/src/components/formFields';
import { AsyncCreatableSelect } from '#/src/components/Select';
import Spacing from '#/src/components/Spacing';
import { useUrls, useHttpClient } from '#/src/contexts/contextHooks';
import { getTestIdProps } from '#/src/utils';
import searchAmmattinimikkeetByTerm from '#/src/utils/api/searchAmmattinimikkeetByTerm';
import searchAvainsanatByTerm from '#/src/utils/api/searchAvainsanatByTerm';
import { memoize } from '#/src/utils/memoize';

const CreatableField = createFormFieldComponent(
  AsyncCreatableSelect,
  ({ input: { onChange, ...input }, maxItems, ...props }) => ({
    ...input,
    onBlur: _.noop,
    onChange: v => _.isArray(v) && v.length <= maxItems && onChange(v),
    maxItems,
    ...props,
  })
);

const MAX_ITEMS = 5;

const makeLoadAmmattinimikkeet = memoize(
  (httpClient, apiUrls, language) => inputValue => {
    return searchAmmattinimikkeetByTerm({
      httpClient,
      apiUrls,
      language,
      term: inputValue,
    }).then(result =>
      result.map(r => ({
        value: r,
        label: r,
      }))
    );
  }
);

const makeLoadAvainsanat = memoize(
  (httpClient, apiUrls, language) => inputValue => {
    return searchAvainsanatByTerm({
      httpClient,
      apiUrls,
      language,
      term: inputValue,
    }).then(result =>
      result.map(r => ({
        value: r,
        label: r,
      }))
    );
  }
);

const NayttamisTiedotSection = ({ language, name }) => {
  const { t } = useTranslation();
  const httpClient = useHttpClient();
  const apiUrls = useUrls();

  return (
    <>
      <Spacing marginBottom={2}>
        <div {...getTestIdProps('ammattinimikkeetSelect')}>
          <Field
            name={`${name}.ammattinimikkeet.${language}`}
            component={CreatableField}
            isMulti
            isClearable
            loadOptions={makeLoadAmmattinimikkeet(
              httpClient,
              apiUrls,
              language
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
            name={`${name}.avainsanat.${language}`}
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
