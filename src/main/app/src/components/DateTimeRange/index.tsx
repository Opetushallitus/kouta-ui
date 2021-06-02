import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { Flex, FlexItem } from '#/src/components/Flex';
import { FormFieldDateTimeInput } from '#/src/components/formFields';
import RemoveButton from '#/src/components/RemoveButton';
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
    <Flex mb={2} alignStart {...props}>
      <FlexItem grow={1} paddingRight={2} {...getTestIdProps('alkaa')}>
        <Field
          label={t('yleiset.alkaa')}
          component={FormFieldDateTimeInput}
          helperText={t('yleiset.paivamaaraJaKellonaika')}
          required
          {...startProps}
        />
      </FlexItem>
      <FlexItem grow={1} paddingLeft={2} {...getTestIdProps('paattyy')}>
        <Field
          label={t('yleiset.paattyy')}
          component={FormFieldDateTimeInput}
          helperText={t('yleiset.paivamaaraJaKellonaika')}
          {...endProps}
        />
      </FlexItem>
      {onRemove && (
        <FlexItem grow={0} marginTop={4} paddingLeft={2}>
          <RemoveButton onClick={onRemove} />
        </FlexItem>
      )}
    </Flex>
  );
};

export default DateTimeRange;
