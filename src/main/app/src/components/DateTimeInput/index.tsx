import React, { useRef, useState, useEffect, useCallback } from 'react';

import _ from 'lodash';

import DatePickerInput from '#/src/components/DatePickerInput';
import TimeInput from '#/src/components/TimeInput';
import { Box, FormControl, FormLabel } from '#/src/components/virkailija';
import {
  getKoutaDateString,
  isValidDate,
  isNumeric,
  getTestIdProps,
} from '#/src/utils';

const generateId = () =>
  `DateTimeInput__${Math.round(Math.random() * 10000).toString()}`;

const useId = () => {
  const ref = useRef();

  if (!ref.current) {
    ref.current = generateId();
  }

  return ref.current;
};

const getTime = value => {
  const [hour, minute] = value.split(':');

  return hour && minute ? [hour, minute].join(':') : '';
};

const isValidTime = value => {
  if (!_.isString(value)) {
    return false;
  }

  const [hour, minute] = value.split(':');

  return isNumeric(hour) && isNumeric(minute);
};

const parseValue = value => {
  if (!_.isString(value)) {
    return {
      date: undefined,
      time: '00:00',
    };
  }

  const maybeDate = new Date(value);

  const [, timePart] = value.split('T');

  return {
    date: isValidDate(maybeDate) ? maybeDate : undefined,
    time: timePart ? getTime(timePart) : '00:00',
  };
};

const isValidState = ({ date, time }) => {
  return isValidDate(date) && isValidTime(time);
};

const formatValue = ({ date, time }) => {
  const [hour, minute] = time.split(':');

  const newDate = new Date(date);

  newDate.setHours(isNumeric(hour) ? parseInt(hour, 10) : 0);
  newDate.setMinutes(isNumeric(minute) ? parseInt(minute, 10) : 0);

  return getKoutaDateString(newDate);
};

const getCompactTime = time => {
  if (!isValidTime(time)) {
    return '';
  }

  const [hour, minute] = time.split(':');

  return `${parseInt(hour)}:${parseInt(minute)}`;
};

export const DateTimeInput = ({
  value,
  onChange,
  dateLabel,
  timeLabel,
  disabled = false,
  error = false,
  datePlaceholder = '',
  timePlaceholder = '',
}) => {
  const { date: dateValue, time: timeValue } = parseValue(value);
  const dateId = useId();
  const timeId = useId();
  const [date, setDate] = useState(dateValue);
  const [time, setTime] = useState(timeValue);
  const formControlProps = { disabled, error };

  useEffect(() => {
    isValidDate(dateValue) && setDate(dateValue);
  }, [JSON.stringify(dateValue)]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    isValidTime(timeValue) &&
      getCompactTime(timeValue) !== getCompactTime(time) &&
      setTime(timeValue);
  }, [timeValue, time]);

  const onTimeChange = useCallback(
    time => {
      setTime(time);

      isValidState({ date, time })
        ? onChange(formatValue({ date, time }))
        : onChange(null);
    },
    [onChange, JSON.stringify(date)] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const onDateChange = useCallback(
    d => {
      setDate(d);

      isValidState({ date: d, time })
        ? onChange(formatValue({ date: d, time }))
        : onChange(null);
    },
    [onChange, time]
  );

  return (
    <Box display="flex" {...getTestIdProps('DateTimeInput')}>
      <Box
        flexBasis="280px"
        flexShrink={0}
        flexGrow={1}
        paddingRight={1}
        {...getTestIdProps('DateTimeInput__Date')}
      >
        <FormControl {...formControlProps}>
          {dateLabel ? (
            <FormLabel htmlFor={dateId}>{dateLabel}</FormLabel>
          ) : null}
          <DatePickerInput
            inputProps={{ id: dateId }}
            value={date}
            onChange={onDateChange}
            placeholder={datePlaceholder}
          />
        </FormControl>
      </Box>
      <Box
        flexBasis="178px"
        flexShrink={0}
        flexGrow={1}
        paddingLeft={1}
        {...getTestIdProps('DateTimeInput__Time')}
      >
        <FormControl {...formControlProps}>
          {timeLabel ? (
            <FormLabel htmlFor={timeId}>{timeLabel}</FormLabel>
          ) : null}
          <TimeInput
            id={timeId}
            value={time}
            onChange={onTimeChange}
            placeholder={timePlaceholder}
          />
        </FormControl>
      </Box>
    </Box>
  );
};

export default DateTimeInput;
