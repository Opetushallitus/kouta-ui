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

function useOrganisaatioOidsWithRights(): Array<string> | undefined {
  const isOph = useIsOphVirkailija();
  const user = useAuthorizedUser();

  return useMemo(() => {
    if (isOph) return undefined;
    return (
      user?.organisaatiot
        ?.filter(({ kayttooikeudet }) =>
          kayttooikeudet.some(({ oikeus }) =>
            ['READ_UPDATE', 'CRUD'].includes(oikeus)
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
          page.data?.map(({ id, nimi, koulutustoimija }) => ({
            value: String(id),
            label: createOpetussuunnitelmaLabel(
              id,
              nimi,
              koulutustoimija,
              language
            ),
          })) ?? []
      ) ?? [],
    [query.data, language]
  );

  return { ...query, options };
};

const useOpetussuunnitelmaByIdOption = (
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

  const organisaatioOids = useOrganisaatioOidsWithRights();

  const {
    options: opetussuunnitelmaOptions,
    isLoading: isLoadingOps,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteOpetussuunnitelmat({
    organisaatioOids,
    nimi,
  });

  const selectedOpetussuunnitelma = useKoulutusFormField(
    'paikallisetTutkinnonOsat.opetussuunnitelmaId'
  );
  const selectedOpetussuunnitelmaId = selectedOpetussuunnitelma?.value;

  const { data: selectedOpetussuunnitelmaOptionWithId } =
    useOpetussuunnitelmaByIdOption(selectedOpetussuunnitelma);

  const selectedOpetussuunnitelmaOption =
    selectedOpetussuunnitelmaOptionWithId ?? selectedOpetussuunnitelma;

  const allOpetussuunnitelmaOptions = useMemo(() => {
    if (
      !selectedOpetussuunnitelmaOption ||
      opetussuunnitelmaOptions.some(
        opt => opt.value === selectedOpetussuunnitelmaOption.value
      )
    ) {
      return opetussuunnitelmaOptions;
    }
    return [selectedOpetussuunnitelmaOption, ...opetussuunnitelmaOptions];
  }, [selectedOpetussuunnitelmaOption, opetussuunnitelmaOptions]);

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
          options={allOpetussuunnitelmaOptions}
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
