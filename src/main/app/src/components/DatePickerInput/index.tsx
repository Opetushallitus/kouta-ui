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

type DatePickerProps = {
  disabled?: boolean;
  value?: Date;
  onChange: (d: Date | undefined | null) => void;
  inputProps?: object;
  placeholder?: string;
};

export const DatePickerInput = ({
  disabled = false,
  value,
  onChange,
  inputProps = {},
  placeholder,
  ...props
}: DatePickerProps) => {
  const { t } = useTranslation();

  const localizationProps = useMemo(() => getLocalizationProps(t), [t]);

  return (
    <UiDatePickerInput
      dayPickerProps={localizationProps}
      {...props}
      value={isValid(value) ? value : ''}
      onChange={e => {
        onChange(isValid(e) ? e : null);
      }}
      inputProps={{ ...inputProps, disabled }}
    />
  );
};
