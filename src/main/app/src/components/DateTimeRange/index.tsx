import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldDateTimeInput } from '#/src/components/formFields';
import RemoveButton from '#/src/components/RemoveButton';
import { Box } from '#/src/components/virkailija';
import { getTestIdProps } from '#/src/utils';

type DateTimeRangeProps = {
  startProps?: object;
  endProps?: object;
  onRemove?: () => void;
};

export const DateTimeRange: React.FC<DateTimeRangeProps> = ({
  startProps = {},
  endProps = {},
  onRemove,
  ...props
}) => {
  const { t } = useTranslation();
  return (
    <Box display="flex" alignItems="flex-start" mb={2} {...props}>
      <Box flexGrow={1} paddingRight={2} {...getTestIdProps('alkaa')}>
        <Field
          label={t('yleiset.alkaa')}
          component={FormFieldDateTimeInput}
          helperText={t('yleiset.paivamaaraJaKellonaika')}
          required={true}
          {...startProps}
        />
      </Box>
      <Box flexGrow={1} paddingLeft={2} {...getTestIdProps('paattyy')}>
        <Field
          label={t('yleiset.paattyy')}
          component={FormFieldDateTimeInput}
          helperText={t('yleiset.paivamaaraJaKellonaika')}
          required={false}
          {...endProps}
        />
      </Box>
      {onRemove && (
        <Box flexGrow={0} marginTop={4} paddingLeft={2}>
          <RemoveButton onClick={onRemove} />
        </Box>
      )}
    </Box>
  );
};

export default DateTimeRange;
