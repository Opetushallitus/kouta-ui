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

const getLocalisationProps = t => ({
  months: monthKeys.map(k => t(`yleiset.kuukaudet.${k}`)),
  weekdaysShort: weekdayShortKeys.map(v =>
    t(`yleiset.viikonpaivalyhenteet.${v}`)
  ),
  firstDayOfWeek: 1,
});

const DatePickerInput = ({
  dayPickerProps = {},
  disabled,
  value,
  ...props
}) => {
  const { t } = useTranslation();

  const localisationProps = useMemo(() => getLocalisationProps(t), [t]);

  return (
    <UiDatePickerInput
      dayPickerProps={{
        ...localisationProps,
        ...dayPickerProps,
      }}
      {...props}
      value={isValid(value) ? value : undefined}
      inputProps={{ ...(props?.inputProps ?? {}), disabled }}
    />
  );
};

export default DatePickerInput;
