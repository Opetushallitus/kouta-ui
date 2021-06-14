import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';
import styled from 'styled-components';

import DividerHeading from '#/src/components/DividerHeading';
import FieldGroup from '#/src/components/FieldGroup';
import { FormFieldInput, FormFieldUrlInput } from '#/src/components/formFields';
import { KoodistoCollapseList } from '#/src/components/KoodistoCollapseList';
import { Box, Typography } from '#/src/components/virkailija';
import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import { useLanguageTab } from '#/src/contexts/LanguageTabContext';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import { useKoodisto } from '#/src/hooks/useKoodisto';
import { koodiUriWithoutVersion } from '#/src/utils/koodi/koodiUriWithoutVersion';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';

const DiplomiKuvausHeading = styled(Typography).attrs({ variant: 'h6' })`
  margin-bottom: 8px;
`;

const DiplomiKuvausUnorderedList = styled.ul`
  margin-top: 8px;
  margin-bottom: 16px;
`;

const EPerusteDiplomiKuvaus = ({ diplomiTiedot }) => {
  const { t } = useTranslation();
  const language = useLanguageTab();
  const sisallot = diplomiTiedot?.sisallot?.[0]?.sisallot;
  const tavoitteet = diplomiTiedot?.tavoitteet;

  return (
    <Box mb={2}>
      {tavoitteet && (
        <>
          <DiplomiKuvausHeading>
            {t('eperuste.yleisetTavoitteet')}
          </DiplomiKuvausHeading>
          <Typography variant="body">
            {getFirstLanguageValue(tavoitteet?.kohde, language)}
          </Typography>
          <Typography variant="body">
            <DiplomiKuvausUnorderedList>
              {tavoitteet?.tavoitteet?.map(tavoite => (
                <li key={tavoite._id}>
                  {getFirstLanguageValue(tavoite, language)}
                </li>
              ))}
            </DiplomiKuvausUnorderedList>
          </Typography>
        </>
      )}
      {sisallot && (
        <>
          <DiplomiKuvausHeading>
            {t('eperuste.keskeisetSisallot')}
          </DiplomiKuvausHeading>
          <Typography variant="body">
            <DiplomiKuvausUnorderedList>
              {sisallot.map(sisalto => (
                <li key={sisalto._id}>
                  {getFirstLanguageValue(sisalto, language)}
                </li>
              ))}
            </DiplomiKuvausUnorderedList>
          </Typography>
        </>
      )}
      <Typography variant="secondary" as="div" marginTop={1}>
        ({t('yleiset.lahde')}: {t('yleiset.ePerusteet')})
      </Typography>
    </Box>
  );
};

const getEPerusteLukiodiplomiTiedot = async ({
  httpClient,
  apiUrls,
  moduuliId,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('eperusteet-service.lukiodiplomi-tiedot', moduuliId)
  );
  return data;
};

const useEPerusteLukiodiplomiTiedot = moduuliId =>
  useApiQuery(
    'getEPerusteLukiodiplomiTiedot',
    getEPerusteLukiodiplomiTiedot,
    {
      moduuliId,
    },
    { ...LONG_CACHE_QUERY_OPTIONS, enabled: Boolean(moduuliId) }
  );

const DiplomiCollapseContent = ({
  koodiUri: koodiUriWithVersion,
  name,
  index,
  itemProps = {},
}) => {
  const { t } = useTranslation();

  const koodiUri = koodiUriWithoutVersion(koodiUriWithVersion);
  const language = useLanguageTab();

  const moduuliId = itemProps?.diplomiMapping?.[koodiUri];

  const { data: lukiodiplomiTiedot } = useEPerusteLukiodiplomiTiedot(moduuliId);

  return (
    <>
      <EPerusteDiplomiKuvaus diplomiTiedot={lukiodiplomiTiedot} />
      <Box display="flex" justifyContent="stretch">
        <Box flexGrow={1} mr={2}>
          <Field
            name={`${name}.linkit[${index}].url.${language}`}
            label={t('toteutuslomake.linkki')}
            component={FormFieldUrlInput}
          />
        </Box>
        <Box flexGrow={1}>
          <Field
            name={`${name}.linkit[${index}].alt.${language}`}
            label={t('toteutuslomake.linkinAltTeksti')}
            component={FormFieldInput}
          />
        </Box>
      </Box>
    </>
  );
};

const getEPerusteLukiodiplomit = async ({ httpClient, apiUrls }) => {
  const { data } = await httpClient.get(
    apiUrls.url('eperusteet-service.lukiodiplomit')
  );
  return data;
};

const useEPerusteLukiodiplomit = () =>
  useApiQuery(
    'getEPerusteLukiodiplomit',
    getEPerusteLukiodiplomit,
    {},
    {
      ...LONG_CACHE_QUERY_OPTIONS,
      select: data => data?.moduulit,
    }
  );

const useDiplomiKoodiUriToEPerusteModuuliId = lukiodiplomitData =>
  useMemo(
    () =>
      lukiodiplomitData?.reduce(
        (acc, { id, koodi }) => ({
          ...acc,
          [koodi?.uri]: id,
        }),
        {}
      ),
    [lukiodiplomitData]
  );

export const DiplomiFields = ({ name }) => {
  const { t } = useTranslation();

  const { data: lukiodiplomitData } = useEPerusteLukiodiplomit();

  const diplomiKoodiUriToEPerusteToModuuliId = useDiplomiKoodiUriToEPerusteModuuliId(
    lukiodiplomitData
  );

  const { data: koodistoData } = useKoodisto({
    koodisto: 'moduulikoodistolops2021',
  });

  const filteredKoodistoData = useMemo(
    () =>
      koodistoData?.filter(
        ({ koodiUri }) => diplomiKoodiUriToEPerusteToModuuliId?.[koodiUri]
      ),
    [koodistoData, diplomiKoodiUriToEPerusteToModuuliId]
  );

  return (
    <FieldGroup title={t('toteutuslomake.lukiodiplomi')}>
      <KoodistoCollapseList
        koodistoData={filteredKoodistoData}
        selectLabel={t('toteutuslomake.valitseDiplomiOppiaineet')}
        CollapseContent={DiplomiCollapseContent}
        name={name}
        itemProps={{ diplomiMapping: diplomiKoodiUriToEPerusteToModuuliId }}
      />
    </FieldGroup>
  );
};
