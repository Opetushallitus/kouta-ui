import React, { useCallback, useMemo } from 'react';

import debounce from 'debounce-promise';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldAsyncSelect } from '#/src/components/formFields';
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

type Props = {
  disabled: boolean;
  organisaatioOid: string;
  name?: string;
};

const useOpetussuunnitelmaOptions = (organisaatioOid: string) => {
  const language = useUserLanguage();
  return useApiQuery(
    'getOpetussuunnitelmat',
    getOpetussuunnitelmat,
    { organisaatioOid },
    {
      enabled: Boolean(organisaatioOid),
      select: response =>
        response.data?.map(({ id, nimi }) => ({
          value: String(id),
          label: getLanguageValue(nimi, language) ?? String(id),
        })) ?? [],
    }
  );
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
  organisaatioOid,
}: Props) => {
  const { t } = useTranslation();
  const language = useUserLanguage();
  const httpClient = useHttpClient();
  const apiUrls = useUrls();
  const { data: opetussuunnitelmaOptions, isLoading: isLoadingOps } =
    useOpetussuunnitelmaOptions(organisaatioOid);

  const loadOpetussuunnitelmat = useCallback(
    async (inputValue: string) => {
      if (!organisaatioOid) {
        return [];
      }
      try {
        const data = await getOpetussuunnitelmat({
          httpClient,
          apiUrls,
          organisaatioOid,
          nimi: inputValue,
        });
        return (
          data.data?.map(({ id, nimi }) => ({
            value: String(id),
            label: getLanguageValue(nimi, language) ?? String(id),
          })) ?? []
        );
      } catch (error) {
        console.error('Error loading opetussuunnitelmat:', error);
        return [];
      }
    },
    [organisaatioOid, httpClient, apiUrls, language]
  );

  const debouncedLoadOpetussuunnitelmat = useMemo(
    () => debounce(loadOpetussuunnitelmat, 500),
    [loadOpetussuunnitelmat]
  );

  const selectedToteutussuunnitelma = useKoulutusFormField(
    'paikallisetTutkinnonOsat.toteutussuunnitelmaId'
  );
  const selectedTotsuId = selectedToteutussuunnitelma?.value;

  const {
    data: paikallisetTutkinnonosatOptions,
    isLoading: isLoadingTutkinnonosat,
  } = usePaikallisetTutkinnonosatOptions(selectedTotsuId);

  const loadPaikallisetTutkinnonosat = useLoadOptions(
    paikallisetTutkinnonosatOptions
  );

  return (
    <Box>
      <Box mb={2}>
        <Field
          name="paikallisetTutkinnonOsat.toteutussuunnitelmaId"
          component={FormFieldAsyncSelect}
          label={t('koulutuslomake.valitseToteutussuunnitelma')}
          loadOptions={debouncedLoadOpetussuunnitelmat}
          defaultOptions={opetussuunnitelmaOptions}
          disabled={disabled}
          isLoading={isLoadingOps}
        />
      </Box>
      <Box>
        <Field
          name="paikallisetTutkinnonOsat.tutkinnonOsat"
          component={FormFieldAsyncSelect}
          label={t('koulutuslomake.valitsePaikallisetTutkinnonOsat')}
          loadOptions={loadPaikallisetTutkinnonosat}
          defaultOptions={paikallisetTutkinnonosatOptions}
          disabled={disabled || !selectedTotsuId}
          isLoading={isLoadingTutkinnonosat}
          isMulti
        />
      </Box>
    </Box>
  );
};
