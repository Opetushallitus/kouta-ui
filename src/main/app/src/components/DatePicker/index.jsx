import React, { useMemo } from 'react';
import DayPicker from 'react-day-picker';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { createGlobalStyle } from 'styled-components';

import 'react-day-picker/lib/style.css';

import { getThemeProp } from '../../theme';
import Input, { AddonIcon } from '../Input';
import { isValidDate, formatDate, isNumeric, isString } from '../../utils';
import { useTranslation } from '../useTranslation';

const monthKeys = [
  'tammikuu',
  'helmikuu',
  'maaliskuu',
  'huhtikuu',
  'toukokuu',
  'kesakuu',
  'heinakuu',
  'elokuu',
  'syyskuu',
  'lokakuu',
  'marraskuu',
  'joulukuu',
];

const weekdayShortKeys = ['su', 'ma', 'ti', 'ke', 'to', 'pe', 'la'];

const getLocalisationProps = t => ({
  months: monthKeys.map(k => t(`yleiset.kuukaudet.${k}`)),
  weekdaysShort: weekdayShortKeys.map(v =>
    t(`yleiset.viikonpaivalyhenteet.${v}`),
  ),
});

const firstYear = new Date(0).getFullYear();

const DatePickerStyle = createGlobalStyle`
  .DatePicker__ {
    .DayPicker-Caption {
      color: ${getThemeProp('palette.text.primary')} !important;
    }

    .DayPicker-wrapper {
      font-family: ${getThemeProp('typography.fontFamily')};
    }

    .DayPicker-Day {
      color: ${getThemeProp('palette.text.primary')};

      &:not(.DayPicker-Day--outside):not(.DayPicker-Day--selected) {
        &:hover {
          background-color: rgba(0, 0, 0, .05) !important;
        }
      }
    }
    
    .DayPicker-Day--today {
      color: ${getThemeProp('palette.primary.main')};
      font-weight: normal !important;
    }

    .DayPicker-Day--selected:not(.DayPicker-Day--outside) {
      background-color: ${getThemeProp('palette.primary.main')} !important;
      font-weight: normal !important;
    }

    .DayPicker-Weekday {
      color: ${getThemeProp('palette.text.secondary')} !important;
    }
  }

  .DatePickerOverlay__ {
    border: 1px solid ${getThemeProp('palette.border')};
    border-radius: ${getThemeProp('shape.borderRadius')};
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.15);
    background-color: white;
  }

  .DatePickerOverlayWrapper__ {
    display: inline-block !important;
    transform: translateY(${getThemeProp('spacing.unit')}px);
    position: absolute;
    z-index: 1;
  }
`;

export const DatePicker = ({ value, ...props }) => (
  <>
    <DatePickerStyle />
    <DayPicker className="DatePicker__" selectedDays={value} {...props} />
  </>
);

const formatDateFn = (value, format) => {
  return formatDate(value, format);
};

const parseDateFn = (value, format) => {
  if (!isString(value)) {
    return undefined;
  }

  const [day, month, year] = value.split('.');
  const someNonNumeric = [
    isNumeric(day),
    isNumeric(month),
    isNumeric(year),
  ].find(n => !n);

  if (someNonNumeric) {
    return undefined;
  }

  const dayNumber = parseInt(day);
  const monthNumber = parseInt(month);
  const yearNumber = parseInt(year);

  if (yearNumber < firstYear) {
    return undefined;
  }

  const date = new Date(yearNumber, monthNumber - 1, dayNumber);

  return isValidDate(date) ? date : undefined;
};

const datePickerInputClassNames = {
  overlay: 'DatePicker__ DatePickerOverlay__',
  overlayWrapper: 'DatePickerOverlayWrapper__',
  container: 'DatePickerInput__',
};

export const DatePickerInput = ({
  value,
  placeholder = '',
  onChange = () => {},
  inputProps = {},
  error = false,
  ...props
}) => {
  const { t } = useTranslation();
  const localisationProps = useMemo(() => getLocalisationProps(t), [t]);

  return (
    <>
      <DatePickerStyle />
      <DayPickerInput
        classNames={datePickerInputClassNames}
        format="D.M.YYYY"
        selectedDay={value}
        value={value}
        component={Input}
        dayPickerProps={localisationProps}
        inputProps={{
          ...inputProps,
          addonAfter: <AddonIcon type="event" />,
          error,
        }}
        parseDate={parseDateFn}
        formatDate={formatDateFn}
        placeholder={placeholder}
        onDayChange={onChange}
        {...props}
      />
    </>
  );
};

export default DatePicker;
