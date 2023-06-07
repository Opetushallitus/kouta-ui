import React, { useMemo, useState, useEffect, useCallback } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import SegmentTab from '#/src/components/SegmentTab';
import SegmentTabs from '#/src/components/SegmentTabs';
import { Box, Radio, RadioGroup } from '#/src/components/virkailija';
import {
  KOULUTUSTYYPIT,
  TUTKINTOON_JOHTAVAT_KOULUTUSTYYPIT,
  TUTKINTOON_JOHTAVA_KOULUTUSTYYPPIHIERARKIA,
  TUTKINTOON_JOHTAMATON_KOULUTUSTYYPPIHIERARKIA,
} from '#/src/constants';
import { spacing, getThemeProp } from '#/src/theme';
import { getTestIdProps, getKoulutustyyppiTranslationKey } from '#/src/utils';
import iterateTree, { Order } from '#/src/utils/iterateTree';

const SecondLevelContainer = styled(Box).attrs({ flexGrow: 0 })`
  margin-left: ${spacing(4)};
  padding-left: ${spacing(4)};
  border-left: 1px solid ${getThemeProp('palette.divider')};
`;

const useFirstLevelOptions = (hierarkia, t) =>
  _.map(hierarkia, ({ value, disabled }) => ({
    value,
    label: t(getKoulutustyyppiTranslationKey(value)),
    disabled,
  }));

const useSecondLevelOptions = (hierarkia, firstLevelValue, t) => {
  return useMemo(() => {
    const node = hierarkia.find(({ value }) => value === firstLevelValue);

    return _.map(node?.children, ({ value, disabled }) => ({
      value,
      label: t(getKoulutustyyppiTranslationKey(value)),
      disabled,
    }));
  }, [hierarkia, firstLevelValue, t]);
};

const getFirstLevelValue = (hierarkia, selectedValue) => {
  let node = hierarkia.find(({ value }) => value === selectedValue);

  if (node) {
    return node.value;
  }

  node = hierarkia.find(({ children }) =>
    _.some(children, ({ value }) => value === selectedValue)
  );

  return node?.value;
};

const useHierarkia = (johtaaTutkintoon, getIsDisabled) =>
  useMemo(() => {
    const hierarkiaCopy = _.cloneDeep(
      johtaaTutkintoon
        ? TUTKINTOON_JOHTAVA_KOULUTUSTYYPPIHIERARKIA
        : TUTKINTOON_JOHTAMATON_KOULUTUSTYYPPIHIERARKIA
    );

    iterateTree(
      hierarkiaCopy,
      item => {
        // Disable leaves (value is koulutustyyppi) from koulutustyyppi hierarkia based on getIsDisabled().
        // Disable first level if all of its children are disabled.
        // This works because leaves are iterated first
        item.disabled =
          (KOULUTUSTYYPIT.includes(item.value) && getIsDisabled(item.value)) ||
          (item?.children &&
            _.every(item.children, ({ disabled }) => disabled));
      },
      { order: Order.BottomUp }
    );
    return hierarkiaCopy;
  }, [getIsDisabled, johtaaTutkintoon]);

const KoulutustyyppiRadioGroup = ({
  value,
  onChange,
  error,
  options,
  disabled,
}) => {
  return (
    <RadioGroup value={value} onChange={onChange} error={error}>
      {options.map(({ label, value: radioValue, disabled: radioDisabled }) => {
        return (
          <Radio
            value={radioValue}
            disabled={disabled || radioDisabled}
            key={radioValue}
          >
            {label}
          </Radio>
        );
      })}
    </RadioGroup>
  );
};

export const KoulutustyyppiSelect = ({
  value,
  onChange,
  error,
  disabled,
  getIsDisabled = () => false,
}) => {
  const [johtaaTutkintoon, setJohtaaTutkintoon] = useState(true);

  const [firstLevelValue, setFirstLevelValue] = useState();
  const { t } = useTranslation();

  const hierarkia = useHierarkia(johtaaTutkintoon, getIsDisabled);

  useEffect(() => {
    if (value) {
      setJohtaaTutkintoon(TUTKINTOON_JOHTAVAT_KOULUTUSTYYPIT.includes(value));
    }
  }, [value]);

  useEffect(() => {
    if (KOULUTUSTYYPIT.includes(value)) {
      setFirstLevelValue(getFirstLevelValue(hierarkia, value));
    }
  }, [hierarkia, value]);

  const firstLevelOptions = useFirstLevelOptions(hierarkia, t);

  const secondLevelOptions = useSecondLevelOptions(
    hierarkia,
    firstLevelValue,
    t
  );

  const onFirstLevelValueChange = useCallback(
    e => {
      const currentValue = e.target.value;

      setFirstLevelValue(currentValue);

      if (KOULUTUSTYYPIT.includes(currentValue)) {
        onChange(currentValue);
      } else {
        onChange(null);
      }
    },
    [setFirstLevelValue, onChange]
  );

  const hasSecondLevelOptions = !_.isEmpty(secondLevelOptions);

  return (
    <>
      <Box mb={2}>
        <SegmentTabs value={johtaaTutkintoon ? 'tutkintoon_johtavat' : 'muut'}>
          <SegmentTab
            value="tutkintoon_johtavat"
            onClick={() => {
              setJohtaaTutkintoon(true);
            }}
            disabled={disabled}
          >
            {t('koulutustyyppivalikko.tutkintoonJohtavatKoulutustyypit')}
          </SegmentTab>
          <SegmentTab
            value="muut"
            onClick={() => {
              setJohtaaTutkintoon(false);
            }}
            disabled={disabled}
          >
            {t('koulutustyyppivalikko.muutKoulutustyypit')}
          </SegmentTab>
        </SegmentTabs>
      </Box>
      <Box display="flex">
        <Box flexGrow={0} {...getTestIdProps('koulutustyyppi_taso_1')}>
          <KoulutustyyppiRadioGroup
            value={firstLevelValue}
            onChange={onFirstLevelValueChange}
            error={error}
            disabled={disabled}
            options={firstLevelOptions}
          />
        </Box>
        {hasSecondLevelOptions && (
          <SecondLevelContainer {...getTestIdProps('koulutustyyppi_taso_2')}>
            <KoulutustyyppiRadioGroup
              options={secondLevelOptions}
              value={value}
              disabled={disabled}
              onChange={e => onChange(e.target.value)}
              error={error}
            />
          </SecondLevelContainer>
        )}
      </Box>
    </>
  );
};

export default KoulutustyyppiSelect;
