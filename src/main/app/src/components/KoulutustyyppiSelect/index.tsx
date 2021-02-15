import React, { useMemo, useState, useEffect, useCallback } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import SegmentTab from '#/src/components/SegmentTab';
import SegmentTabs from '#/src/components/SegmentTabs';
import { Box, Radio, RadioGroup } from '#/src/components/virkailija';
import {
  KOULUTUSTYYPIT,
  KOULUTUSTYYPPI,
  TUTKINTOON_JOHTAVAT_KOULUTUSTYYPIT,
} from '#/src/constants';
import { spacing, getThemeProp } from '#/src/theme';
import { getTestIdProps } from '#/src/utils';
import iterateTree, { Order } from '#/src/utils/iterateTree';

export const TUTKINTOON_JOHTAVA_KOULUTUSTYYPPIHIERARKIA = [
  { value: KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS },
  {
    value: 'korkeakoulutus',
    children: [
      { value: KOULUTUSTYYPPI.YLIOPISTOKOULUTUS },
      { value: KOULUTUSTYYPPI.AMKKOULUTUS },
    ],
  },
  { value: KOULUTUSTYYPPI.LUKIOKOULUTUS },
];

export const TUTKINTOON_JOHTAMATON_KOULUTUSTYYPPIHIERARKIA = [
  {
    value: 'ammatillinen',
    children: [
      { value: KOULUTUSTYYPPI.VALMA },
      { value: KOULUTUSTYYPPI.TELMA },
      { value: KOULUTUSTYYPPI.TUTKINNON_OSA },
      { value: KOULUTUSTYYPPI.OSAAMISALA },
      { value: KOULUTUSTYYPPI.MUUT_KOULUTUKSET },
    ],
  },
  {
    value: 'korkeakoulutus',
    children: [
      { value: KOULUTUSTYYPPI.AVOIN_YO },
      { value: KOULUTUSTYYPPI.AVOIN_AMK },
      { value: KOULUTUSTYYPPI.TAYDENNYS_KOULUTUS },
      { value: KOULUTUSTYYPPI.ERIKOISTUMISKOULUTUS },
      { value: KOULUTUSTYYPPI.VALMENTAVA_KOULUTUS },
      { value: KOULUTUSTYYPPI.AMMATILLINEN_OPETTAJAKOULUTUS },
      { value: KOULUTUSTYYPPI.AMMATILLINEN_OPINTO_OHJAAJA_KOULUTUS },
      { value: KOULUTUSTYYPPI.AMMATILLINEN_ERITYISOPETTAJA_KOULUTUS },
    ],
  },
  { value: KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO },
  { value: KOULUTUSTYYPPI.LUVA },
  { value: KOULUTUSTYYPPI.PERUSOPETUKSEN_LISAOPETUS },
];

const SecondLevelContainer = styled(Box).attrs({ flexGrow: 0 })`
  margin-left: ${spacing(4)};
  padding-left: ${spacing(4)};
  border-left: 1px solid ${getThemeProp('palette.divider')};
`;

const getTranslationKey = tyyppi => `koulutustyypit.${_.camelCase(tyyppi)}`;

const useFirstLevelOptions = (hierarkia, t) =>
  _.map(hierarkia, ({ value, disabled }) => ({
    value,
    label: t(getTranslationKey(value)),
    disabled,
  }));

const useSecondLevelOptions = (hierarkia, firstLevelValue, t) => {
  return useMemo(() => {
    const node = hierarkia.find(({ value }) => value === firstLevelValue);

    return _.map(node?.children, ({ value, disabled }) => ({
      value,
      label: t(getTranslationKey(value)),
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
    const h = johtaaTutkintoon
      ? TUTKINTOON_JOHTAVA_KOULUTUSTYYPPIHIERARKIA
      : TUTKINTOON_JOHTAMATON_KOULUTUSTYYPPIHIERARKIA;

    const hCopy = _.cloneDeep(h);

    iterateTree(
      hCopy,
      item => {
        item.disabled =
          (KOULUTUSTYYPIT.includes(item.value) && getIsDisabled(item.value)) ||
          (item?.children &&
            _.every(item.children, ({ disabled }) => disabled));
      },
      { order: Order.BottomUp }
    );
    return hCopy;
  }, [getIsDisabled, johtaaTutkintoon]);

const KoulutustyyppiRadioGroup = ({ value, onChange, error, options }) => {
  return (
    <RadioGroup value={value} onChange={onChange} error={error}>
      {options.map(({ label, value: radioValue, disabled }) => {
        return (
          <Radio value={radioValue} disabled={disabled} key={radioValue}>
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
  const [johtaaTutkintoon, setJohtaaTutkintoon] = useState(
    TUTKINTOON_JOHTAVAT_KOULUTUSTYYPIT.includes(value)
  );

  const [firstLevelValue, setFirstLevelValue] = useState();
  const { t } = useTranslation();

  const hierarkia = useHierarkia(johtaaTutkintoon, getIsDisabled);

  useEffect(() => {
    setJohtaaTutkintoon(TUTKINTOON_JOHTAVAT_KOULUTUSTYYPIT.includes(value));
  }, [value]);

  useEffect(() => {
    setFirstLevelValue(getFirstLevelValue(hierarkia, value));
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
            options={firstLevelOptions}
          />
        </Box>
        {hasSecondLevelOptions && (
          <SecondLevelContainer {...getTestIdProps('koulutustyyppi_taso_2')}>
            <KoulutustyyppiRadioGroup
              options={secondLevelOptions}
              value={value}
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
