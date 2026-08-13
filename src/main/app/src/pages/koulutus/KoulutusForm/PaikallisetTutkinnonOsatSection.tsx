import React, { useEffect, useMemo, useState } from 'react';

import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useInfiniteQuery } from 'react-query';
import { Field } from 'redux-form';

import { FormFieldSelect } from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';
import { ORGANISAATIOTYYPPI } from '#/src/constants';
import { useAuthorizedUser } from '#/src/contexts/AuthorizedUserContext';
import { useHttpClient } from '#/src/contexts/HttpClientContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { useKoulutusFormField } from '#/src/hooks/form';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';
import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import { getOpetussuunnitelmaById } from '#/src/utils/ePeruste/getOpetussuunnitelmaById';
import { getOpetussuunnitelmat } from '#/src/utils/ePeruste/getOpetussuunnitelmat';
import { getPaikallisetTutkinnonosat } from '#/src/utils/ePeruste/getPaikallisetTutkinnonosat';
import { getLanguageValue } from '#/src/utils/languageUtils';
import { flatFilterHierarkia } from '#/src/utils/organisaatio/hierarkiaHelpers';

type PaikallisetTutkinnonOsatProps = {
  disabled: boolean;
};

function useOppilaitosOidsWithRights(): {
  isLoading: boolean;
  oppilaitosOids?: Array<string>;
} {
  const isOph = useIsOphVirkailija();
  const user = useAuthorizedUser();

  const rawOids = useMemo(() => {
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

  const { hierarkia, isLoading } = useOrganisaatioHierarkia(rawOids, {
    skipParents: true,
    enabled: (rawOids?.length ?? 0) > 0,
  });

  const oppilaitosOids = useMemo(() => {
    if (isOph || isLoading) return undefined;
    return flatFilterHierarkia(
      hierarkia,
      org =>
        org.organisaatiotyyppiUris?.includes(ORGANISAATIOTYYPPI.OPPILAITOS) ??
        false
    ).map(org => org.oid);
  }, [isOph, isLoading, hierarkia]);

  return {
    isLoading,
    oppilaitosOids,
  };
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

  useEffect(() => {
    const timer = setTimeout(() => setNimi(inputValue), 300);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const { oppilaitosOids, isLoading: isLoadingOppilaitosOids } =
    useOppilaitosOidsWithRights();

  const {
    options: opetussuunnitelmaOptions,
    isLoading: isLoadingOps,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteOpetussuunnitelmat({ organisaatioOids: oppilaitosOids, nimi });

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
          label={t('koulutuslomake.valitseOpetussuunnitelma')}
          options={allOpetussuunnitelmaOptions}
          disabled={disabled || !isEmpty(selectedTutkinnonOsat)}
          isLoading={
            isLoadingOps || isLoadingOppilaitosOids || isFetchingNextPage
          }
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
