import React, { useMemo } from 'react';

import getYear from 'date-fns/getYear';
import { parseInt, times } from 'lodash-es';

import Select from '#/src/components/Select';
import { isNumeric } from '#/src/utils';

const SELECTABLE_YEARS_COUNT = 20;

const currentYear = getYear(new Date());

const getYearOptions = ({ min, max }) =>
  times(max - min, index => ({
    value: `${min + index}`,
    label: `${min + index}`,
  }));

export const YearSelect = ({ min: minProp, max: maxProp, ...props }) => {
  const min = isNumeric(minProp) ? parseInt(minProp) : currentYear;
  const max = isNumeric(maxProp)
    ? parseInt(maxProp)
    : min + SELECTABLE_YEARS_COUNT;

  const options = useMemo(() => getYearOptions({ min, max }), [min, max]);

  return <Select options={options} {...props} />;
};

export default YearSelect;
