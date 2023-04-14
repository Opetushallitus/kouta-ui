import React, { useRef, useState, useEffect, useCallback } from 'react';

import { isString } from 'lodash/fp';

import { DatePickerInput } from '#/src/components/DatePickerInput';
import { Box, FormControl } from '#/src/components/virkailija';
import { getKoutaDateString, isValidDate, getTestIdProps } from '#/src/utils';

const generateId = () =>
  `DateTimeInput__${Math.round(Math.random() * 10000).toString()}`;

const useId = () => {
  const ref = useRef<string>();

  if (!ref.current) {
    ref.current = generateId();
  }

  return ref.current;
};

const parseValue = value => {
  if (!isString(value)) {
    return {
      date: undefined,
      time: '00:00',
    };
  }

  const maybeDate = new Date(value);

  return {
    date: isValidDate(maybeDate) ? maybeDate : undefined,
    time: '00:00',
  };
};

const isValidState = ({ date }) => {
  return isValidDate(date);
};

const formatValue = ({ date }) => {
  const newDate = new Date(date);

  newDate.setHours(0);
  newDate.setMinutes(0);

  return getKoutaDateString(newDate);
};

export const DateInput = ({
  value,
  onChange,
  disabled = false,
  error = false,
  datePlaceholder = '',
}) => {
  const { date: dateValue } = parseValue(value);
  const dateId = useId();
  const [date, setDate] = useState(dateValue);
  const formControlProps = { disabled, error };

  useEffect(() => {
    isValidDate(dateValue) && setDate(dateValue);
  }, [JSON.stringify(dateValue)]); // eslint-disable-line react-hooks/exhaustive-deps

  const onDateChange = useCallback(
    d => {
      setDate(d);

      isValidState({ date: d })
        ? onChange(formatValue({ date: d }))
        : onChange(null);
    },
    [onChange]
  );

  return (
    <Box display="flex" {...getTestIdProps('DateInput')}>
      <Box
        flexBasis="280px"
        flexShrink={1}
        flexGrow={1}
        paddingRight={1}
        {...getTestIdProps('DateInput__Date')}
      >
        <FormControl {...formControlProps}>
          <DatePickerInput
            inputProps={{ id: dateId }}
            value={date}
            onChange={onDateChange}
            placeholder={datePlaceholder}
          />
        </FormControl>
      </Box>
    </Box>
  );
};
