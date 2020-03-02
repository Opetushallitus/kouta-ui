import React, { useMemo, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { camelCase, isArray, isEmpty } from 'lodash';

import {
  TUTKINTOON_JOHTAVA_KOULUTUSTYYPPIHIERARKIA,
  TUTKINTOON_JOHTAMATON_KOULUTUSTYYPPIHIERARKIA,
  TUTKINTOON_JOHTAVAT_KOULUTUSTYYPIT,
  KOULUTUSTYYPPI,
} from '../../constants';

import { RadioGroup } from '../Radio';
import { getTestIdProps } from '../../utils';
import Box from '../Box';
import { spacing, getThemeProp } from '../../theme';
import useTranslation from '../useTranslation';
import SegmentTabs from '../SegmentTabs';
import SegmentTab from '../SegmentTab';

const SecondLevelContainer = styled(Box).attrs({ flexGrow: 0 })`
  margin-left: ${spacing(4)};
  padding-left: ${spacing(4)};
  border-left: 1px solid ${getThemeProp('palette.divider')};
`;

const getTranslationKey = tyyppi => `koulutustyypit.${camelCase(tyyppi)}`;

const getFirstLevelOptions = (hierarkia, t) => {
  return isArray(hierarkia)
    ? hierarkia.map(({ tyyppi }) => ({
        value: tyyppi,
        label: t(getTranslationKey(tyyppi)),
      }))
    : [];
};

const getSecondLevelOptions = (hierarkia, firstLevelValue, t) => {
  const node = hierarkia.find(({ tyyppi }) => tyyppi === firstLevelValue);

  if (!node) {
    return [];
  }

  return (node.children || []).map(({ tyyppi }) => ({
    value: tyyppi,
    label: t(getTranslationKey(tyyppi)),
  }));
};

const getFirstLevelValue = (hierarkia, value) => {
  let node = hierarkia.find(({ tyyppi }) => tyyppi === value);

  if (node) {
    return node.tyyppi;
  }

  node = hierarkia.find(({ children }) =>
    Boolean((children || []).find(({ tyyppi }) => tyyppi === value)),
  );

  return node ? node.tyyppi : undefined;
};

export const KoulutustyyppiSelect = ({ value, onChange, error }) => {
  const [johtaaTutkintoon, setJohtaaTutkintoon] = useState(
    TUTKINTOON_JOHTAVAT_KOULUTUSTYYPIT.includes(value),
  );

  const [firstLevelValue, setFirstLevelValue] = useState();
  const { t } = useTranslation();

  const hierarkia = useMemo(() => {
    return johtaaTutkintoon
      ? TUTKINTOON_JOHTAVA_KOULUTUSTYYPPIHIERARKIA
      : TUTKINTOON_JOHTAMATON_KOULUTUSTYYPPIHIERARKIA;
  }, [johtaaTutkintoon]);

  useEffect(() => {
    setJohtaaTutkintoon(TUTKINTOON_JOHTAVAT_KOULUTUSTYYPIT.includes(value));
  }, [value]);

  useEffect(() => {
    setFirstLevelValue(getFirstLevelValue(hierarkia, value));
  }, [hierarkia, value]);

  const firstLevelOptions = useMemo(() => getFirstLevelOptions(hierarkia, t), [
    hierarkia,
    t,
  ]);

  const secondLevelOptions = useMemo(
    () => getSecondLevelOptions(hierarkia, firstLevelValue, t),
    [hierarkia, firstLevelValue, t],
  );

  const onFirstLevelValueChange = useCallback(
    e => {
      const node = hierarkia.find(({ tyyppi }) => tyyppi === e.target.value);

      setFirstLevelValue(node.tyyppi);

      if (isEmpty(node.children)) {
        onChange(e.target.value);
      } else {
        onChange(node.children[0].tyyppi);
      }
    },
    [setFirstLevelValue, onChange, hierarkia],
  );

  const hasSecondLevelOptions = !isEmpty(secondLevelOptions);

  const onTutkintoonJohtavatClick = useCallback(() => {
    if (!johtaaTutkintoon) {
      onChange(KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS);
    }

    setJohtaaTutkintoon(true);
  }, [onChange, johtaaTutkintoon]);

  const onMuutClick = useCallback(() => {
    if (johtaaTutkintoon) {
      onChange(KOULUTUSTYYPPI.VALMA);
    }

    setJohtaaTutkintoon(false);
  }, [onChange, johtaaTutkintoon]);

  const onSecondLevelValueChange = useCallback(e => onChange(e.target.value), [
    onChange,
  ]);

  return (
    <>
      <Box mb={2}>
        <SegmentTabs value={johtaaTutkintoon ? 'tutkintoon_johtavat' : 'muut'}>
          <SegmentTab
            value="tutkintoon_johtavat"
            onClick={onTutkintoonJohtavatClick}
          >
            {t('koulutustyyppivalikko.tutkintoonJohtavatKoulutustyypit')}
          </SegmentTab>
          <SegmentTab value="muut" onClick={onMuutClick}>
            {t('koulutustyyppivalikko.muutKoulutustyypit')}
          </SegmentTab>
        </SegmentTabs>
      </Box>
      <Box display="flex">
        <Box flexGrow={0} {...getTestIdProps('koulutustyyppi_taso_1')}>
          <RadioGroup
            options={firstLevelOptions}
            value={firstLevelValue}
            onChange={onFirstLevelValueChange}
            error={error}
          />
        </Box>
        {hasSecondLevelOptions && (
          <SecondLevelContainer {...getTestIdProps('koulutustyyppi_taso_2')}>
            <RadioGroup
              options={secondLevelOptions}
              value={value}
              onChange={onSecondLevelValueChange}
              error={error}
            />
          </SecondLevelContainer>
        )}
      </Box>
    </>
  );
};

export default KoulutustyyppiSelect;
