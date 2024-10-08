import React, { useCallback, useEffect, useMemo } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import Select from '#/src/components/Select';
import { Box, Input, InputIcon } from '#/src/components/virkailija';
import {
  getJulkaisutilaTranslationKey,
  JULKAISUTILA,
  NAKYVYYS,
  TUTKINTOON_JOHTAMATON_KOULUTUSTYYPPIHIERARKIA,
  TUTKINTOON_JOHTAVA_KOULUTUSTYYPPIHIERARKIA,
} from '#/src/constants';
import { useDebounceState } from '#/src/hooks/useDebounceState';
import { useKoodistoOptions } from '#/src/hooks/useKoodistoOptions';
import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';
import { useSelectedOrganisaatioOid } from '#/src/hooks/useSelectedOrganisaatio';
import { koulutustyyppiHierarkiaToOptions } from '#/src/utils';
import { useAsiointiKieli } from '#/src/utils/api/getAsiointiKieli';
import { getKoulutuksenAlkamisvuosiOptions } from '#/src/utils/getKoulutuksenAlkamisvuosiOptions';
import { flattenHierarkia } from '#/src/utils/organisaatio/hierarkiaHelpers';

const NAME_INPUT_DEBOUNCE_TIME = 300;

const useTilaOptions = t =>
  useMemo(
    () =>
      _fp.flow(
        _fp.values,
        _fp.remove(_fp.isEqual(JULKAISUTILA.POISTETTU)),
        _fp.map(tila => ({
          label: t(getJulkaisutilaTranslationKey(tila)),
          value: tila,
        }))
      )(JULKAISUTILA),
    [t]
  );

const useKoulutustyyppiOptions = t =>
  useMemo(
    () => [
      {
        label: t('koulutustyyppivalikko.tutkintoonJohtavatKoulutustyypit'),
        options: koulutustyyppiHierarkiaToOptions(
          TUTKINTOON_JOHTAVA_KOULUTUSTYYPPIHIERARKIA,
          t
        ),
      },
      {
        label: t('koulutustyyppivalikko.muutKoulutustyypit'),
        options: koulutustyyppiHierarkiaToOptions(
          TUTKINTOON_JOHTAMATON_KOULUTUSTYYPPIHIERARKIA,
          t
        ),
      },
    ],
    [t]
  );

const useNakyvyysOptions = t =>
  useMemo(
    () =>
      Object.values(NAKYVYYS).map(value => ({
        label: t(`nakyvyys.${value}`),
        value,
      })),
    [t]
  );

export const Filters = ({
  onNimiChange,
  onHakuNimiChange,
  onTilaChange,
  onKoulutustyyppiChange,
  nimiPlaceholder = '',
  onHakutapaChange,
  onNakyvyysChange,
  onKoulutuksenAlkamiskausiChange,
  onKoulutuksenAlkamisvuosiChange,
  onOrgWhitelistChange,
  entityType,
  state,
}) => {
  const { t } = useTranslation();

  const tilaOptions = useTilaOptions(t);

  const koulutustyyppiOptions = useKoulutustyyppiOptions(t);

  const entityState = state?.context?.values;

  const parseChildOrgs = (hierarkia, lang) => {
    const flatHierarkia = flattenHierarkia(hierarkia);
    const result = [];
    flatHierarkia.forEach(org => {
      if (org?.nimi) {
        const label = org.nimi[lang] ? org.nimi[lang] : org.nimi.fi;
        result.push({ label: label, value: org.oid });
      }
    });
    return result;
  };

  const selectedOrganisaatioOid = useSelectedOrganisaatioOid();

  const { data: selectedLanguage } = useAsiointiKieli();

  const { hierarkia } = useOrganisaatioHierarkia(selectedOrganisaatioOid, {
    skipParents: true,
  });

  const childOrgOptions = useMemo(
    () => parseChildOrgs(hierarkia, selectedLanguage),
    [hierarkia, selectedLanguage]
  );

  const { options: hakutapaOptions } = useKoodistoOptions({
    koodisto: 'hakutapa',
  });

  const [usedNimi, setUsedNimi, debouncedNimi] = useDebounceState(
    entityState?.nimi,
    NAME_INPUT_DEBOUNCE_TIME
  );

  const [usedHakuNimi, setUsedHakuNimi, debouncedHakuNimi] = useDebounceState(
    entityState?.hakuNimi,
    NAME_INPUT_DEBOUNCE_TIME
  );

  useEffect(() => {
    onNimiChange(debouncedNimi);
  }, [onNimiChange, debouncedNimi]);

  useEffect(() => {
    onHakuNimiChange(debouncedHakuNimi);
  }, [onHakuNimiChange, debouncedHakuNimi]);

  const onNimiChangeDebounced = useCallback(
    e => setUsedNimi(e.target.value),
    [setUsedNimi]
  );

  const onHakuNimiChangeDebounced = useCallback(
    e => setUsedHakuNimi(e.target.value),
    [setUsedHakuNimi]
  );

  const nakyvyysOptions = useNakyvyysOptions(t);

  const koulutuksenAlkamisvuosiOptions = getKoulutuksenAlkamisvuosiOptions(t);
  const { options: koulutuksenAlkamiskausiOptions } = useKoodistoOptions({
    koodisto: 'kausi',
  });

  return (
    <Box display="flex" alignItems="center">
      <Box flexGrow={1} minWidth="100px" flexBasis="400px" paddingRight={2}>
        <Input
          placeholder={nimiPlaceholder}
          value={usedNimi}
          onChange={onNimiChangeDebounced}
          suffix={<InputIcon type="search" />}
        />
      </Box>
      {entityType === 'hakukohde' ? (
        <Box flexGrow={1} minWidth="100px" flexBasis="400px" paddingRight={2}>
          <Input
            placeholder={t('etusivu.haeHakuja')}
            value={usedHakuNimi}
            onChange={onHakuNimiChangeDebounced}
            suffix={<InputIcon type="search" />}
          />
        </Box>
      ) : null}
      {onKoulutustyyppiChange && (
        <Box flexGrow={1} minWidth="200px" paddingRight={2}>
          <Select
            options={koulutustyyppiOptions}
            placeholder={t('yleiset.koulutustyyppi')}
            value={entityState?.koulutustyyppi}
            onChange={onKoulutustyyppiChange}
            isMulti
          />
        </Box>
      )}
      {onOrgWhitelistChange && (
        <Box flexGrow={1} minWidth="200px" paddingRight={2}>
          <Select
            options={childOrgOptions}
            placeholder={t('yleiset.aliorganisaatio')}
            value={entityState?.orgWhitelist}
            onChange={onOrgWhitelistChange}
            isMulti
          />
        </Box>
      )}
      <Box flexGrow={0} minWidth="150px" paddingRight={2}>
        <Select
          options={tilaOptions}
          onChange={onTilaChange}
          placeholder={t('yleiset.tila')}
          value={entityState?.tila}
          isMulti
        />
      </Box>
      {onHakutapaChange && (
        <Box flexGrow={0} flexBasis="200px" paddingRight={2}>
          <Select
            options={hakutapaOptions}
            onChange={onHakutapaChange}
            placeholder={t('yleiset.hakutapa')}
            value={entityState?.hakutapa}
            isMulti
          />
        </Box>
      )}
      {onNakyvyysChange && (
        <Box flexGrow={0} flexBasis="200px" paddingRight={2}>
          <Select
            options={nakyvyysOptions}
            onChange={onNakyvyysChange}
            placeholder={t('yleiset.nakyvyys')}
            value={entityState?.nakyvyys}
          />
        </Box>
      )}
      <>
        {onKoulutuksenAlkamiskausiChange && (
          <Box flexGrow={0} flexBasis="200px" paddingRight={2}>
            <Select
              options={koulutuksenAlkamiskausiOptions}
              onChange={onKoulutuksenAlkamiskausiChange}
              placeholder={t('yleiset.koulutuksenAlkamiskausi')}
              value={entityState?.koulutuksenAlkamiskausi}
            />
          </Box>
        )}
        {onKoulutuksenAlkamisvuosiChange && (
          <Box flexGrow={0} flexBasis="200px" paddingRight={2}>
            <Select
              options={koulutuksenAlkamisvuosiOptions}
              onChange={onKoulutuksenAlkamisvuosiChange}
              placeholder={t('yleiset.koulutuksenAlkamisvuosi')}
              value={entityState?.koulutuksenAlkamisvuosi}
              isMulti
            />
          </Box>
        )}
      </>
    </Box>
  );
};

export default Filters;
