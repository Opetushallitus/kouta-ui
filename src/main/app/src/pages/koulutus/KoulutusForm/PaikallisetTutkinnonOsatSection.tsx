import React, { useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useInfiniteQuery } from 'react-query';
import { Field } from 'redux-form';

import {
  FormFieldAsyncSelect,
  FormFieldSelect,
} from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';
import { useHttpClient } from '#/src/contexts/HttpClientContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { useKoulutusFormField } from '#/src/hooks/form';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import useLoadOptions from '#/src/hooks/useLoadOptions';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import { getOpetussuunnitelmat } from '#/src/utils/ePeruste/getOpetussuunnitelmat';
import { getPaikallisetTutkinnonosat } from '#/src/utils/ePeruste/getPaikallisetTutkinnonosat';
import { getLanguageValue } from '#/src/utils/languageUtils';

type PaikallisetTutkinnonOsatProps = {
  disabled: boolean;
};

const useInfiniteOpetussuunnitelmat = ({
  organisaatioOids,
  nimi,
}: {
  organisaatioOids?: Array<string>;
  nimi?: string;
}) => {
  const httpClient = useHttpClient();
  const apiUrls = useUrls();
  const language = useUserLanguage();

  const query = useInfiniteQuery(
    ['getOpetussuunnitelmat', organisaatioOids, nimi],
    ({ pageParam = 0 }) =>
      getOpetussuunnitelmat({
        httpClient,
        apiUrls,
        organisaatioOids,
        nimi,
        sivu: pageParam,
      }),
    {
      getNextPageParam: lastPage =>
        lastPage.sivu != null &&
        lastPage.sivuja != null &&
        lastPage.sivu < lastPage.sivuja
          ? lastPage.sivu + 1
          : undefined,
      cacheTime: 0,
    }
  );

  const options = useMemo(
    () =>
      query.data?.pages.flatMap(
        page =>
          page.data?.map(({ id, nimi }) => ({
            value: String(id),
            label: getLanguageValue(nimi, language) ?? String(id),
          })) ?? []
      ) ?? [],
    [query.data, language]
  );

  return { ...query, options };
};

const usePaikallisetTutkinnonosatOptions = (opsId?: string) => {
  const language = useUserLanguage();
  return useApiQuery(
    'getPaikallisetTutkinnonosat',
    getPaikallisetTutkinnonosat,
    { opsId },
    {
      enabled: Boolean(opsId),
      select: response =>
        response.map(({ id, nimi }) => ({
          value: String(id),
          label: getLanguageValue(nimi, language) ?? String(id),
        })),
    }
  );
};

export const PaikallisetTutkinnonOsatSection = ({
  disabled,
}: PaikallisetTutkinnonOsatProps) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [nimi, setNimi] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setNimi(inputValue), 300);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const {
    options: opetussuunnitelmaOptions,
    isLoading: isLoadingOps,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteOpetussuunnitelmat({ nimi });

  const selectedOpetussuunnitelmaId = useKoulutusFormField(
    'paikallisetTutkinnonOsat.toteutussuunnitelmaId'
  );
  const selectedOpsId = selectedOpetussuunnitelmaId?.value;

  const {
    data: paikallisetTutkinnonosatOptions,
    isLoading: isLoadingTutkinnonosat,
  } = usePaikallisetTutkinnonosatOptions(selectedOpsId);

  const loadPaikallisetTutkinnonosat = useLoadOptions(
    paikallisetTutkinnonosatOptions
  );

  return (
    <Box>
      <Box mb={2}>
        <Field
          name="paikallisetTutkinnonOsat.toteutussuunnitelmaId"
          component={FormFieldSelect}
          label={t('koulutuslomake.valitseToteutussuunnitelma')}
          options={opetussuunnitelmaOptions}
          disabled={disabled}
          isLoading={isLoadingOps || isFetchingNextPage}
          inputValue={inputValue}
          onInputChange={value => {
            // TODO: Reset paikalliset tutkinnon osat when changing toteutussuunnitelma
            setInputValue(value);
          }}
          onMenuScrollToBottom={() => hasNextPage && fetchNextPage()}
        />
      </Box>
      <Box>
        <Field
          name="paikallisetTutkinnonOsat.tutkinnonosat"
          component={FormFieldAsyncSelect}
          label={t('koulutuslomake.valitsePaikallisetTutkinnonOsat')}
          loadOptions={loadPaikallisetTutkinnonosat}
          defaultOptions={paikallisetTutkinnonosatOptions}
          disabled={disabled || !selectedOpsId}
          isLoading={isLoadingTutkinnonosat}
          isMulti
        />
      </Box>
    </Box>
  );
};
