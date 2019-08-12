import React, { useMemo, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import camelCase from 'lodash/camelCase';

import {
  TUTKINTOON_JOHTAVA_KOULUTUSTYYPPIHIERARKIA,
  TUTKINTOON_JOHTAMATON_KOULUTUSTYYPPIHIERARKIA,
} from '../../constants';

import { RadioGroup } from '../Radio';
import { isArray, getTestIdProps } from '../../utils';
import isEmpty from '../../utils/isEmpty';
import Flex, { FlexItem } from '../Flex';
import { spacing, getThemeProp } from '../../theme';
import useTranslation from '../useTranslation';

const SecondLevelContainer = styled(FlexItem).attrs({ grow: 0 })`
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

export const KoulutustyyppiSelect = ({
  johtaaTutkintoon = true,
  value,
  onChange,
  error,
}) => {
  const [firstLevelValue, setFirstLevelValue] = useState();
  const { t } = useTranslation();

  const hierarkia = useMemo(() => {
    return johtaaTutkintoon
      ? TUTKINTOON_JOHTAVA_KOULUTUSTYYPPIHIERARKIA
      : TUTKINTOON_JOHTAMATON_KOULUTUSTYYPPIHIERARKIA;
  }, [johtaaTutkintoon]);

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
        onChange(e);
      }
    },
    [setFirstLevelValue, onChange, hierarkia],
  );

  const hasSecondLevelOptions = !isEmpty(secondLevelOptions);

  return (
    <Flex>
      <FlexItem grow={0} {...getTestIdProps('koulutustyyppi_taso_1')}>
        <RadioGroup
          options={firstLevelOptions}
          value={firstLevelValue}
          onChange={onFirstLevelValueChange}
          error={error}
        />
      </FlexItem>
      {hasSecondLevelOptions && (
        <SecondLevelContainer {...getTestIdProps('koulutustyyppi_taso_2')}>
          <RadioGroup
            options={secondLevelOptions}
            value={value}
            onChange={onChange}
            error={error}
          />
        </SecondLevelContainer>
      )}
    </Flex>
  );
};

export default KoulutustyyppiSelect;
