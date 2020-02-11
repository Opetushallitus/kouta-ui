import React from 'react';
import { Field } from 'redux-form';
import { isArray, isNil } from 'lodash';
import Button from './Button';
import Flex, { FlexItem } from './Flex';
import { getTestIdProps } from './../utils';
import Box from './Box';
import FormControl from './FormControl';
import { FormFieldDateTimeInput } from './formFields';

export default ({ fields, t, meta: { error } }) => (
  <>
    <FormControl
      error={!isNil(error)}
      helperText={error && isArray(error) ? t(...error) : t(error)}
    >
      {fields.map((hakuaika, index) => (
        <Flex key={index} mb={2} alignCenter>
          <FlexItem grow={1} paddingRight={2} {...getTestIdProps('alkaa')}>
            <Field
              name={`${hakuaika}.alkaa`}
              component={FormFieldDateTimeInput}
              label={t('yleiset.alkaa')}
              helperText={t('yleiset.paivamaaraJaKellonaika')}
            />
          </FlexItem>
          <FlexItem grow={1} paddingLeft={2} {...getTestIdProps('paattyy')}>
            <Field
              name={`${hakuaika}.paattyy`}
              component={FormFieldDateTimeInput}
              label={t('yleiset.paattyy')}
              helperText={t('yleiset.paivamaaraJaKellonaika')}
            />
          </FlexItem>
          <FlexItem grow={0} paddingLeft={2}>
            <Button
              onClick={() => fields.remove(index)}
              variant="outlined"
              color="secondary"
            >
              {t('yleiset.poista')}
            </Button>
          </FlexItem>
        </Flex>
      ))}
    </FormControl>
    <Box marginTop={2}>
      <Button
        type="button"
        variant="outlined"
        onClick={() => {
          fields.push({});
        }}
        {...getTestIdProps('lisaaButton')}
      >
        {t('yleiset.lisaaHakuaika')}
      </Button>
    </Box>
  </>
);
