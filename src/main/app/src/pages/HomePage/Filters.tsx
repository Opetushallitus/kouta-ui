import React, { useCallback, useMemo, useRef, useState } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import {
  TUTKINTOON_JOHTAMATON_KOULUTUSTYYPPIHIERARKIA,
  TUTKINTOON_JOHTAVA_KOULUTUSTYYPPIHIERARKIA,
} from '#/src/components/KoulutustyyppiSelect';
import Select from '#/src/components/Select';
import { Box, Input, InputIcon } from '#/src/components/virkailija';
import {
  getJulkaisutilaTranslationKey,
  getKoulutustyyppiTranslationKey,
  JULKAISUTILA,
} from '#/src/constants';

const NAME_INPUT_DEBOUNCE_TIME = 300;

const useTilaOptions = t =>
  useMemo(
    () =>
      Object.keys(JULKAISUTILA).map(key => ({
        label: t(getJulkaisutilaTranslationKey(JULKAISUTILA[key])),
        value: JULKAISUTILA[key],
      })),
    [t]
  );

const hierarkiaToOptions = (hierarkia, t) =>
  hierarkia.flatMap(({ value: topValue, children }) => {
    if (children) {
      return children.map(({ value }) => ({
        label:
          t(getKoulutustyyppiTranslationKey(topValue)) +
          ' - ' +
          t(getKoulutustyyppiTranslationKey(value)),
        value,
      }));
    } else {
      return [
        {
          label: t(getKoulutustyyppiTranslationKey(topValue)),
          value: topValue,
        },
      ];
    }
  });

const useKoulutustyyppiOptions = t =>
  useMemo(
    () => [
      {
        label: t('koulutustyyppivalikko.tutkintoonJohtavatKoulutustyypit'),
        options: hierarkiaToOptions(
          TUTKINTOON_JOHTAVA_KOULUTUSTYYPPIHIERARKIA,
          t
        ),
      },
      {
        label: t('koulutustyyppivalikko.muutKoulutustyypit'),
        options: hierarkiaToOptions(
          TUTKINTOON_JOHTAMATON_KOULUTUSTYYPPIHIERARKIA,
          t
        ),
      },
    ],
    [t]
  );

export const Filters = ({
  nimi,
  onNimiChange,
  onTilaChange,
  onKoulutustyyppiChange,
  nimiPlaceholder = '',
  koulutustyyppi,
}) => {
  const { t } = useTranslation();

  const tilaOptions = useTilaOptions(t);

  const koulutustyyppiOptions = useKoulutustyyppiOptions(t);

  const [usedNimi, setUsedNimi] = useState(nimi);
  const debouncedNimiChange = useRef(
    _.debounce(value => onNimiChange(value), NAME_INPUT_DEBOUNCE_TIME)
  );
  const onNimiChangeDebounced = useCallback(e => {
    const value = e.target.value;
    setUsedNimi(value);
    debouncedNimiChange.current(value);
  }, []);

  return (
    <Box display="flex" alignItems="center">
      <Box flexGrow={1} paddingRight={2}>
        <Input
          placeholder={nimiPlaceholder}
          value={usedNimi}
          onChange={onNimiChangeDebounced}
          suffix={<InputIcon type="search" />}
        />
      </Box>
      {onKoulutustyyppiChange && (
        <Box flexGrow={0} flexBasis="350px" paddingRight={2}>
          <Select
            options={koulutustyyppiOptions}
            placeholder={t('yleiset.koulutustyyppi')}
            value={koulutustyyppi}
            onChange={onKoulutustyyppiChange}
            isMulti
          />
        </Box>
      )}
      <Box flexGrow={0} flexBasis="200px" paddingRight={2}>
        <Select
          options={tilaOptions}
          onChange={onTilaChange}
          placeholder={t('yleiset.tila')}
          isMulti
          isClearable
        />
      </Box>
    </Box>
  );
};

export default Filters;
