import { useEffect, useMemo, useState } from 'react';

import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useInfiniteQuery } from 'react-query';
import { Field } from 'redux-form';

import { FormFieldSelect } from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';
import {
  OPETUSHALLITUS_ORGANISAATIO_OID,
  ORGANISAATIOTYYPPI,
} from '#/src/constants';
import { useAuthorizedUser } from '#/src/contexts/AuthorizedUserContext';
import { useHttpClient } from '#/src/contexts/HttpClientContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { useKoulutusFormField } from '#/src/hooks/form';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';
import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import { OrganisaatioModel } from '#/src/types/domainTypes';
import { getOpetussuunnitelmaById } from '#/src/utils/ePeruste/getOpetussuunnitelmaById';
import { getOpetussuunnitelmat } from '#/src/utils/ePeruste/getOpetussuunnitelmat';
import { getPaikallisetTutkinnonosat } from '#/src/utils/ePeruste/getPaikallisetTutkinnonosat';
import { getLanguageValue } from '#/src/utils/languageUtils';
import { flatFilterHierarkia } from '#/src/utils/organisaatio/hierarkiaHelpers';

type PaikallisetTutkinnonOsatProps = {
  disabled: boolean;
};

function useKoulutustoimijaOidsWithRights(): {
  isLoading: boolean;
  koulutustoimijaOids?: Array<string>;
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

  // Täältä ei saa haettua parent-organisaatioiden tietoja samalla pyynnöllä, koska pyyntö tehdään
  // listalla organisaatio-oideja, joten haetaan parent-organisaatioiden tiedot erikseen parent-oideja hyödyntäen
  const { hierarkia = [], isLoading } = useOrganisaatioHierarkia(rawOids, {
    skipParents: true,
    enabled: (rawOids?.length ?? 0) > 0,
  });

  const parentOids = isOph
    ? undefined
    : hierarkia
        ?.flatMap((org: OrganisaatioModel): Array<string> => org.parentOids)
        .filter(
          (oid: string): boolean => oid !== OPETUSHALLITUS_ORGANISAATIO_OID
        );

  const {
    hierarkia: parentHierarkia = [],
    isLoading: isParentHierarkiaLoading,
  } = useOrganisaatioHierarkia(parentOids, {
    skipParents: true,
    enabled: (parentOids?.length ?? 0) > 0,
  });

  const koulutustoimijaOids = useMemo(() => {
    if (isOph || isLoading || isParentHierarkiaLoading) return undefined;
    return flatFilterHierarkia(
      [...hierarkia, ...parentHierarkia],
      (org: OrganisaatioModel) =>
        org.organisaatiotyyppiUris?.includes(
          ORGANISAATIOTYYPPI.KOULUTUSTOIMIJA
        ) ?? false
    ).map((org: OrganisaatioModel) => org.oid);
  }, [isOph, isLoading, isParentHierarkiaLoading, hierarkia, parentHierarkia]);

  return {
    isLoading: isLoading || isParentHierarkiaLoading,
    koulutustoimijaOids,
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

  // eperusteet-amosaa-service/api/external/opetussuunnitelmat-rajapinta tunnistaa vain
  // koulutustoimija-organisaatiot, joten päätellään käyttäjän organisaatioiden perusteella
  // niiden koulutustoimija-parentit, jotta saadaan opsit haettua
  const { koulutustoimijaOids, isLoading: isLoadingOppilaitosOids } =
    useKoulutustoimijaOidsWithRights();

  const {
    options: opetussuunnitelmaOptions,
    isLoading: isLoadingOps,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteOpetussuunnitelmat({
    organisaatioOids: koulutustoimijaOids,
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
