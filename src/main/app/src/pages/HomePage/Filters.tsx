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
import { koulutustyyppiHierarkiaToOptions } from '#/src/utils';
import { getKoulutuksenAlkamisvuosiOptions } from '#/src/utils/getKoulutuksenAlkamisvuosiOptions';
import useOrganisaatioHierarkia from "#/src/hooks/useOrganisaatioHierarkia";
import {flattenHierarkia} from "#/src/utils/organisaatio/hierarkiaHelpers";
import {useSelectedOrganisaatioOid} from "#/src/hooks/useSelectedOrganisaatio";
import {useAsiointiKieli} from "#/src/utils/api/getAsiointiKieli";

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
  nimi,
  onNimiChange,
  onTilaChange,
  onKoulutustyyppiChange,
  nimiPlaceholder = '',
  koulutustyyppi,
  tila,
  hakutapa,
  onHakutapaChange,
  onNakyvyysChange,
  nakyvyys,
  koulutuksenAlkamiskausi,
  onKoulutuksenAlkamiskausiChange,
  koulutuksenAlkamisvuosi,
  onKoulutuksenAlkamisvuosiChange,
  orgWhitelist,
  onOrgWhitelistChange,
}) => {
  const { t } = useTranslation();

  const tilaOptions = useTilaOptions(t);

  const koulutustyyppiOptions = useKoulutustyyppiOptions(t);

  const parseChildOrgs = (hierarkia, selectedOrg, lang) => {
    let flatHierarkia = flattenHierarkia(hierarkia)
    let result = []
    flatHierarkia.forEach(org => {
        if (org?.oid != selectedOrg && org?.nimi) {
            const label = org.nimi[lang] ? org.nimi[lang] : org.nimi.fi
            result.push({label: label, value: org.oid})
        }})
    return result
  }

  const selectedOrganisaatioOid = useSelectedOrganisaatioOid();

  const { data: selectedLanguage } = useAsiointiKieli();

  const { hierarkia } = useOrganisaatioHierarkia(selectedOrganisaatioOid, {skipParents: true})

  const childOrgOptions = useMemo(() => parseChildOrgs(hierarkia, selectedOrganisaatioOid, selectedLanguage), [hierarkia, selectedOrganisaatioOid, selectedLanguage])

  const { options: hakutapaOptions } = useKoodistoOptions({
    koodisto: 'hakutapa',
  });

  const [usedNimi, setUsedNimi, debouncedNimi] = useDebounceState(
    nimi,
    NAME_INPUT_DEBOUNCE_TIME
  );

  useEffect(() => {
    onNimiChange(debouncedNimi);
  }, [onNimiChange, debouncedNimi]);

  const onNimiChangeDebounced = useCallback(
    e => setUsedNimi(e.target.value),
    [setUsedNimi]
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
      {onKoulutustyyppiChange && (
        <Box flexGrow={1} minWidth="200px" paddingRight={2}>
          <Select
            options={koulutustyyppiOptions}
            placeholder={t('yleiset.koulutustyyppi')}
            value={koulutustyyppi}
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
                    value={orgWhitelist}
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
          value={tila}
          isMulti
        />
      </Box>
      {onHakutapaChange && (
        <Box flexGrow={0} flexBasis="200px" paddingRight={2}>
          <Select
            options={hakutapaOptions}
            onChange={onHakutapaChange}
            placeholder={t('yleiset.hakutapa')}
            value={hakutapa}
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
            value={nakyvyys}
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
              value={koulutuksenAlkamiskausi}
            />
          </Box>
        )}
        {onKoulutuksenAlkamisvuosiChange && (
          <Box flexGrow={0} flexBasis="200px" paddingRight={2}>
            <Select
              options={koulutuksenAlkamisvuosiOptions}
              onChange={onKoulutuksenAlkamisvuosiChange}
              placeholder={t('yleiset.koulutuksenAlkamisvuosi')}
              value={koulutuksenAlkamisvuosi}
              isMulti
            />
          </Box>
        )}
      </>
    </Box>
  );
};

export default Filters;
