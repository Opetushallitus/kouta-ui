import React, { useMemo } from 'react';
import getYear from 'date-fns/getYear';

import Select from '../Select';
import { isNumeric } from '../../utils';

const currentYear = getYear(new Date());

const getYearOptions = ({ min, max }) =>
  [...new Array(max - min)].map((value, index) => ({
    value: `${min + index}`,
    label: `${min + index}`,
  }));

export const YearSelect = ({ min: minProp, max: maxProp, ...props }) => {
  const min = isNumeric(minProp) ? parseInt(minProp) : currentYear;
  const max = isNumeric(maxProp) ? parseInt(maxProp) : min + 20;

  const options = useMemo(() => getYearOptions({ min, max }), [min, max]);

  return <Select options={options} {...props} />;
};

export default YearSelect;
