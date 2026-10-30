import React, { Dispatch, useMemo, useRef, useState } from 'react';

import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import { Field, FieldArray, FieldArrayFieldsProps } from 'redux-form';
import styled from 'styled-components';

import FieldArrayList from '#/src/components/FieldArrayList';
import { FormButton } from '#/src/components/FormButton';
import { FormFieldSelect } from '#/src/components/formFields';
import { Box, FormLabel, Radio, RadioGroup } from '#/src/components/virkailija';
import { KOULUTUS_ROLE } from '#/src/constants';
import { useAuthorizedUser } from '#/src/contexts/AuthorizedUserContext';
import { useFieldValue, useKoulutusFormField } from '#/src/hooks/form';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import useAuthorizedUserRoleBuilder from '#/src/hooks/useAuthorizedUserRoleBuilder';
import { useDebounceState } from '#/src/hooks/useDebounceState';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import { spacing } from '#/src/theme';
import { getLanguageOptions, isTruthy } from '#/src/utils';
import { getOpetussuunnitelmaById } from '#/src/utils/ePeruste/getOpetussuunnitelmaById';
import { useQueryOptionsGetOpetussuunnitelmat } from '#/src/utils/ePeruste/getOpetussuunnitelmat';
import { getPaikallisetTutkinnonosat } from '#/src/utils/ePeruste/getPaikallisetTutkinnonosat';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';

import { StyledInfoBox } from './AmmatillinenTiedotSection/InfoBox';

type PaikallisetTutkinnonOsatProps = {
  disabled: boolean;
};

function useOrganisaatioOidsWithUpdateRights(): Array<string> {
  const user = useAuthorizedUser();
  const roleBuilder = useAuthorizedUserRoleBuilder();

  return useMemo(
    () =>
      user?.organisaatiot
        ?.filter(({ organisaatioOid }) =>
          roleBuilder.hasUpdate(KOULUTUS_ROLE, organisaatioOid).result()
        )
        .map(({ organisaatioOid }) => organisaatioOid) ?? [],
    [user, roleBuilder]
  );
}

const createOpetussuunnitelmaLabel = (
  id: number | undefined,
  nimi: TranslatedField<string> | undefined,
  oppilaitos: { nimi?: TranslatedField<string> } | undefined,
  language: LanguageCode
) =>
  (getFirstLanguageValue(nimi, language) ?? String(id)) +
  (oppilaitos ? ` (${getFirstLanguageValue(oppilaitos.nimi, language)})` : '');

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

const useResetOpetussuunnitelmatQueryPageOnNimiChange = (
  kieli: LanguageCode,
  nimi?: string,
  organisaatioOids?: Array<string>
) => {
  const queryClient = useQueryClient();
  const previousNimiRef = useRef(nimi);

  const previousQueryKey = useQueryOptionsGetOpetussuunnitelmat({
    kieli,
    organisaatioOids: organisaatioOids ?? [],
    nimi: previousNimiRef.current,
  }).queryKey;

  if (previousNimiRef.current !== nimi) {
    const previousData = queryClient.getQueryData<{
      pages: Array<unknown>;
      pageParams: Array<unknown>;
    }>(previousQueryKey);
    if (previousData) {
      queryClient.setQueryData(previousQueryKey, {
        pages: previousData.pages.slice(0, 1),
        pageParams: previousData.pageParams.slice(0, 1),
      });
    }
    previousNimiRef.current = nimi;
  }
};

const useInfiniteOpetussuunnitelmaOptions = ({
  selectedLanguage,
  nimi,
  selectedOpetussuunnitelma,
  allSelectedOpetussuunnitelmaIds,
}: {
  selectedLanguage: LanguageCode;
  nimi?: string;
  selectedOpetussuunnitelma?: SelectOption;
  allSelectedOpetussuunnitelmaIds?: Array<string>;
}) => {
  const organisaatioOids = useOrganisaatioOidsWithUpdateRights();

  // Resetoidaan opetussuunnitelmien queryn sivu jos nimi muuttuu, jotta haetaan aina nimen muututtua vain ensimmäinen sivu, eikä kaikkia aiemmin haettuja sivuja.
  useResetOpetussuunnitelmatQueryPageOnNimiChange(
    selectedLanguage,
    nimi,
    organisaatioOids
  );

  const query = useInfiniteQuery(
    useQueryOptionsGetOpetussuunnitelmat({
      organisaatioOids,
      nimi,
      kieli: selectedLanguage,
    })
  );

  const {
    data: selectedOpetussuunnitelmaOptionWithId,
    isLoading: isLoadingSelectedOpetussuunnitelmaOption,
  } = useOpetussuunnitelmaOptionWithLabel(selectedOpetussuunnitelma);

  const selectedOpetussuunnitelmaOptionWithLabel =
    selectedOpetussuunnitelmaOptionWithId ?? selectedOpetussuunnitelma;

  const options = useMemo(() => {
    const otherSelectedOpetussuunnitelmaIds =
      allSelectedOpetussuunnitelmaIds?.filter(
        opsId => opsId !== selectedOpetussuunnitelmaOptionWithLabel?.value
      );
    const opetussuunnitelmaOptions =
      query.data?.pages.flatMap(
        page =>
          page.data?.map(({ id, nimi, koulutustoimija }) => ({
            value: String(id),
            label: createOpetussuunnitelmaLabel(
              id,
              nimi,
              koulutustoimija,
              selectedLanguage
            ),
            isDisabled: otherSelectedOpetussuunnitelmaIds?.includes(String(id)),
          })) ?? []
      ) ?? [];

    return !selectedOpetussuunnitelmaOptionWithLabel ||
      opetussuunnitelmaOptions?.some(
        opt => opt.value === selectedOpetussuunnitelmaOptionWithLabel.value
      )
      ? opetussuunnitelmaOptions
      : [selectedOpetussuunnitelmaOptionWithLabel, ...opetussuunnitelmaOptions];
  }, [
    query.data,
    selectedLanguage,
    selectedOpetussuunnitelmaOptionWithLabel,
    allSelectedOpetussuunnitelmaIds,
  ]);

  return {
    ...query,
    isLoading: query.isLoading || isLoadingSelectedOpetussuunnitelmaOption,
    options,
  };
};

const usePaikallisetTutkinnonosatOptions = (
  selectedLanguage: LanguageCode,
  opsId?: string
) => {
  return useApiQuery(
    'getPaikallisetTutkinnonosat',
    getPaikallisetTutkinnonosat,
    { opsId },
    {
      enabled: Boolean(opsId),
      select: response =>
        response.map(({ id, nimi }) => ({
          value: String(id),
          label: getFirstLanguageValue(nimi, selectedLanguage) ?? String(id),
        })),
    }
  );
};

const StyledRadio = styled(Radio)`
  margin-bottom: ${spacing(2)};
  padding-right: ${spacing(3)};
`;

const LanguageSelector = ({
  selectedLanguage,
  setSelectedLanguage,
  disabled,
}: {
  selectedLanguage: LanguageCode;
  setSelectedLanguage: Dispatch<LanguageCode>;
  disabled: boolean;
}) => {
  const { t } = useTranslation();
  const languageOptions = getLanguageOptions(t);

  const id = 'totsu-language-selector';
  return (
    <Box>
      <FormLabel id={id} as="div" marginBottom={1}>
        {t('koulutuslomake.valitseTotsunKieli')}
      </FormLabel>
      <Box aria-labelledby={id} display="flex" flexDirection="row">
        <RadioGroup
          disabled={disabled}
          value={selectedLanguage}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSelectedLanguage(e.target.value as LanguageCode)
          }
        >
          {languageOptions.map(
            ({ value, label }: { value: string; label: string }) => (
              <StyledRadio key={value} value={value}>
                {label}
              </StyledRadio>
            )
          )}
        </RadioGroup>
      </Box>
    </Box>
  );
};

const OpetussuunnitelmanPaikallisetTutkinnonOsat = ({
  disabled,
  name,
  selectedLanguage,
}: {
  disabled: boolean;
  name: string;
  selectedLanguage: LanguageCode;
}) => {
  const allSelectedOpetussuunnitelmaIds = useKoulutusFormField(
    'paikallisetTutkinnonOsat'
  )
    ?.map(({ opetussuunnitelmaId }) => opetussuunnitelmaId?.value)
    .filter(isTruthy);

  const { t } = useTranslation();
  const [inputValue, setInputValue, nimi] = useDebounceState('', 300);

  const selectedOpetussuunnitelma = useFieldValue<SelectOption | undefined>(
    `${name}.opetussuunnitelmaId`
  );

  const {
    options: opetussuunnitelmaOptions,
    isLoading: isLoadingOps,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteOpetussuunnitelmaOptions({
    selectedLanguage,
    nimi,
    selectedOpetussuunnitelma,
    allSelectedOpetussuunnitelmaIds,
  });

  const selectedOpetussuunnitelmaId = selectedOpetussuunnitelma?.value;

  const selectedTutkinnonOsat = useFieldValue<Array<SelectOption> | undefined>(
    `${name}.tutkinnonosat`
  );

  const {
    data: paikallisetTutkinnonosatOptions,
    isLoading: isLoadingTutkinnonosat,
  } = usePaikallisetTutkinnonosatOptions(
    selectedLanguage,
    selectedOpetussuunnitelmaId
  );

  return (
    <StyledInfoBox mt={2}>
      <Box mb={2}>
        <Field
          name={`${name}.opetussuunnitelmaId`}
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
          name={`${name}.tutkinnonosat`}
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
    </StyledInfoBox>
  );
};

const PaikallisetTutkinnonOsatFields = ({
  disabled,
  fields,
}: {
  disabled: boolean;
  fields: FieldArrayFieldsProps<unknown>;
}) => {
  const { t } = useTranslation();

  const userLanguage = useUserLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(
    userLanguage || 'fi'
  );

  return (
    <>
      <LanguageSelector
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        disabled={disabled}
      />
      <FieldArrayList fields={fields}>
        {({ field }) => (
          <OpetussuunnitelmanPaikallisetTutkinnonOsat
            disabled={disabled}
            name={field}
            selectedLanguage={selectedLanguage}
          />
        )}
      </FieldArrayList>
      <Box
        display="flex"
        justifyContent="center"
        mt={fields.length > 0 ? 4 : 0}
      >
        <FormButton
          variant="outlined"
          color="primary"
          type="button"
          onClick={() => fields.push({})}
        >
          {t('koulutuslomake.lisaaToteutussuunnitelma')}
        </FormButton>
      </Box>
    </>
  );
};

export const PaikallisetTutkinnonOsatSection = ({
  disabled,
}: PaikallisetTutkinnonOsatProps) => {
  return (
    <FieldArray
      name="paikallisetTutkinnonOsat"
      component={PaikallisetTutkinnonOsatFields}
      disabled={disabled}
    />
  );
};
