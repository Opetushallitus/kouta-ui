import React from 'react';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';
import { getTestIdProps } from '#/src/utils';
import Button from '#/src/components/Button';
import { FormFieldDateTimeInput } from '#/src/components/formFields';
import Flex, { FlexItem } from '#/src/components/Flex';

export const DateTimeRange = ({ startProps, endProps, onRemove, ...props }) => {
  const { t } = useTranslation();
  return (
    <Flex mb={2} alignStart {...props}>
      <FlexItem grow={1} paddingRight={2} {...getTestIdProps('alkaa')}>
        <Field
          label={t('yleiset.alkaa')}
          component={FormFieldDateTimeInput}
          helperText={t('yleiset.paivamaaraJaKellonaika')}
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
          <Button onClick={onRemove} variant="outlined" color="secondary">
            {t('yleiset.poista')}
          </Button>
        </FlexItem>
      )}
    </Flex>
  );
};

export default DateTimeRange;
