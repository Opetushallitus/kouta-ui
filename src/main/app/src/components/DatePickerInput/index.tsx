import React, { useMemo } from 'react';

import UiDatePickerInput from '@opetushallitus/virkailija-ui-components/DatePickerInput';
import { isValid } from 'date-fns';
import { useTranslation } from 'react-i18next';

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

const getLocalizationProps = t => ({
  months: monthKeys.map(k => t(`yleiset.kuukaudet.${k}`)),
  weekdaysShort: weekdayShortKeys.map(v =>
    t(`yleiset.viikonpaivalyhenteet.${v}`)
  ),
  firstDayOfWeek: 1,
});

export const DatePickerInput = ({
  dayPickerProps = {},
  disabled,
  value,
  onChange,
  ...props
}) => {
  const { t } = useTranslation();

  const localizationProps = useMemo(() => getLocalizationProps(t), [t]);

  return (
    <UiDatePickerInput
      dayPickerProps={{
        ...localizationProps,
        ...dayPickerProps,
      }}
      {...props}
      value={isValid(value) ? value : ''}
      onChange={e => {
        onChange(isValid(e) ? e : null);
      }}
      inputProps={{ ...(props?.inputProps ?? {}), disabled }}
    />
  );
};

export default DatePickerInput;
