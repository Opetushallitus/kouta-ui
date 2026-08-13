import { useEffect, useMemo, useState } from 'react';

import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useInfiniteQuery } from 'react-query';
import { Field } from 'redux-form';

import { FormFieldSelect } from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';
import { useAuthorizedUser } from '#/src/contexts/AuthorizedUserContext';
import { useHttpClient } from '#/src/contexts/HttpClientContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { useKoulutusFormField } from '#/src/hooks/form';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import { getOpetussuunnitelmaById } from '#/src/utils/ePeruste/getOpetussuunnitelmaById';
import { getOpetussuunnitelmat } from '#/src/utils/ePeruste/getOpetussuunnitelmat';
import { getPaikallisetTutkinnonosat } from '#/src/utils/ePeruste/getPaikallisetTutkinnonosat';
import { getLanguageValue } from '#/src/utils/languageUtils';

type PaikallisetTutkinnonOsatProps = {
  disabled: boolean;
};

function useOrganisaatioOidsWithUpdateRights(): Array<string> | undefined {
  const isOph = useIsOphVirkailija();
  const user = useAuthorizedUser();

  return useMemo(() => {
    if (isOph) return undefined;
    return (
      user?.organisaatiot
        ?.filter(({ kayttooikeudet }) =>
          kayttooikeudet.some(
            ({ palvelu, oikeus }) =>
              palvelu === 'KOUTA' &&
              ['UPDATE', 'READ_UPDATE', 'CRUD'].includes(oikeus)
          )
        )
        .map(({ organisaatioOid }) => organisaatioOid) ?? []
    );
  }, [isOph, user]);
}

const createOpetussuunnitelmaLabel = (
  id: number | undefined,
  nimi: TranslatedField<string> | undefined,
  oppilaitos: { nimi?: TranslatedField<string> } | undefined,
  language: LanguageCode
) =>
  (getLanguageValue(nimi, language) ?? String(id)) +
  (oppilaitos ? ` (${getLanguageValue(oppilaitos.nimi, language)})` : '');

const useOpetussuunnitelmaOptionWithLabel = (
  opetussuunnitelmaOption?: SelectOption
) => {
  const language = useUserLanguage();
  const opsId = opetussuunnitelmaOption?.value;
  const opsLabel = opetussuunnitelmaOption?.label;
  return useApiQuery(
    'getOpetussuunnitelmaById',
    getOpetussuunnitelmaById,
    { opsId },
    {
      enabled: Boolean(opsId) && !opsLabel,
      select: ({ id, nimi, koulutustoimija }) => ({
        value: String(id),
        label: createOpetussuunnitelmaLabel(
          id,
          nimi,
          koulutustoimija,
          language
        ),
      }),
    }
  );
};

const useInfiniteOpetussuunnitelmaOptions = ({
  organisaatioOids,
  nimi,
  selectedOpetussuunnitelma,
}: {
  organisaatioOids?: Array<string>;
  nimi?: string;
  selectedOpetussuunnitelma?: SelectOption;
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
      cacheTime: 0,
      getNextPageParam: lastPage =>
        lastPage.sivu != null &&
        lastPage.sivuja != null &&
        lastPage.sivu < lastPage.sivuja
          ? lastPage.sivu + 1
          : undefined,
    }
  );

  const {
    data: selectedOpetussuunnitelmaOptionWithId,
    isLoading: isLoadingSelectedOpetussuunnitelmaOption,
  } = useOpetussuunnitelmaOptionWithLabel(selectedOpetussuunnitelma);

  const selectedOpetussuunnitelmaOptionWithLabel =
    selectedOpetussuunnitelmaOptionWithId ?? selectedOpetussuunnitelma;

  const options = useMemo(() => {
    const opetussuunnitelmaOptions =
      query.data?.pages.flatMap(
        page =>
          page.data?.map(({ id, nimi, koulutustoimija }) => ({
            value: String(id),
            label: createOpetussuunnitelmaLabel(
              id,
              nimi,
              koulutustoimija,
              language
            ),
          })) ?? []
      ) ?? [];

    return !selectedOpetussuunnitelmaOptionWithLabel ||
      opetussuunnitelmaOptions?.some(
        opt => opt.value === selectedOpetussuunnitelmaOptionWithLabel.value
      )
      ? opetussuunnitelmaOptions
      : [selectedOpetussuunnitelmaOptionWithLabel, ...opetussuunnitelmaOptions];
  }, [query.data, language, selectedOpetussuunnitelmaOptionWithLabel]);

  return {
    ...query,
    isLoading: query.isLoading || isLoadingSelectedOpetussuunnitelmaOption,
    options,
  };
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

  // debounce
  useEffect(() => {
    const timer = setTimeout(() => setNimi(inputValue), 300);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const organisaatioOids = useOrganisaatioOidsWithUpdateRights();

  const selectedOpetussuunnitelma = useKoulutusFormField(
    'paikallisetTutkinnonOsat.opetussuunnitelmaId'
  );

  const {
    options: opetussuunnitelmaOptions,
    isLoading: isLoadingOps,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteOpetussuunnitelmaOptions({
    organisaatioOids,
    nimi,
    selectedOpetussuunnitelma,
  });

  const selectedOpetussuunnitelmaId = selectedOpetussuunnitelma?.value;

  const {
    data: paikallisetTutkinnonosatOptions,
    isLoading: isLoadingTutkinnonosat,
  } = usePaikallisetTutkinnonosatOptions(selectedOpetussuunnitelmaId);

  const selectedTutkinnonOsat = useKoulutusFormField(
    'paikallisetTutkinnonOsat.tutkinnonosat'
  );

  return (
    <Box>
      <Box mb={2}>
        <Field
          name="paikallisetTutkinnonOsat.opetussuunnitelmaId"
          component={FormFieldSelect}
          label={t('koulutuslomake.valitseToteutussuunnitelma')}
          options={opetussuunnitelmaOptions}
          disabled={disabled || !isEmpty(selectedTutkinnonOsat)}
          isLoading={isLoadingOps || isFetchingNextPage}
          inputValue={inputValue}
          onInputChange={value => {
            setInputValue(value);
          }}
          onMenuScrollToBottom={() => {
            if (hasNextPage) {
              fetchNextPage();
            }
          }}
        />
      </Box>
      <Box>
        <Field
          name="paikallisetTutkinnonOsat.tutkinnonosat"
          component={FormFieldSelect}
          label={t('koulutuslomake.valitsePaikallisetTutkinnonOsat')}
          options={paikallisetTutkinnonosatOptions}
          disabled={
            disabled || isLoadingTutkinnonosat || !selectedOpetussuunnitelmaId
          }
          isLoading={isLoadingTutkinnonosat}
          isMulti
        />
      </Box>
    </Box>
  );
};
